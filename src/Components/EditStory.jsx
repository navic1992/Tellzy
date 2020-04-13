import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { db } from "./../config/firebaseConfig";
import LinkPage from "./LinkPage";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { isCompositeComponentWithType } from "react-dom/test-utils";
import { isEmpty } from "lodash";

export default class EditStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      validParticipant: {},
      hintText: "",
      storyId: "",
      secret: "",
      story: {},
      submitSuccess: false,
      nextParticipant: null,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    const storyId = params.storyId;
    const secret = params.secret;
    this.getStory(storyId);
    if (secret) {
      this.setState({ storyId, secret });
    } else {
      this.setState({ storyId });
    }
  }

  async getStory(storyId) {
    let storyRef = await db
      .collection("stories")
      .doc(storyId)
      .get()
      .catch(function (error) {
        console.log("Error getting document:", error);
        this.setState({ error: true });
      });

    if (storyRef.exists) {
      const story = storyRef.data();
      // check that secret is valid among participants
      const validParticipant = story.participants.filter(
        (participant) => participant.secret && this.state.secret === participant.secret
      )[0];
      // make hint text
      let hintText = "";
      if (validParticipant) {
        // get hint text to display
        hintText = story.storyParts.reduce((acc, part) => acc + part.text + " ", "");
        if (hintText.length > 200) hintText = hintText.substring(hintText.length - 100, hintText.length - 1);
      }

      this.setState({
        story,
        isLoading: false,
        hintText,
        validParticipant,
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      this.setState({ error: true });
    }
  }

  handleChange(event) {
    let fieldName = event.target.name;
    let fleldVal = event.target.value;
    this.setState({ ...this.state, [fieldName]: fleldVal });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { storyId, story, storyText, validParticipant } = this.state;
    let storyRef = db.collection("stories").doc(storyId);

    // add new story part
    const newStoryPart = {
      author: validParticipant.email,
      timestamp: new Date(),
      text: storyText,
    };
    story.storyParts.push(newStoryPart);

    // set this participant to submitted
    story.participants = story.participants.map((participant) => {
      if (participant.secret === validParticipant.secret)
        return { ...validParticipant, isSubmitted: true, submittedOn: new Date() };
      else return participant;
    });

    await storyRef.set({ ...story }, { merge: true }).catch(function (error) {
      console.error("Error adding document: ", error);
      this.setState({ error: true });
      return;
    });
    // TODO look for next participant to show their email and generate secret link
    let nextParticipant = story.participants.filter((participant) => !participant.isSubmitted);
    if (nextParticipant.length > 0) nextParticipant = nextParticipant[0];
    // TODO consider end of story
    this.setState({
      submitSuccess: true,
      nextParticipant,
    });
  };

  render() {
    const {
      submitSuccess,
      validParticipant,
      story,
      storyId,
      isLoading,
      hintText,
      nextParticipant,
    } = this.state;

    const storyLink = `www.tellzy.web.app/story/${storyId}`;

    return (
      <div className="edit-story">
        <Row className="my-5">
          <Col sm={2}>
            <Link to="/">
              <Button className="btn-home">Home</Button>
            </Link>
          </Col>
          <Col sm={8} className="h-100">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h1 className="h1-es-false text-center text-capitalize">{story.storyTitle}</h1>
                {!isEmpty(validParticipant) ? (
                  <>
                    {validParticipant.isSubmitted ? (
                      <div>
                        This story has already been edited by <br />
                        {validParticipant.email}
                        <br />
                        This link not valid any more, but you can check the progress of{" "}
                        <span className="text-capitalize">"{story.storyTitle}"</span> at <br />
                        <a rel="noopener noreferrer" href={storyLink} target="_blank">
                          {storyLink}
                        </a>
                        <LinkPage story={story} storyId={storyId}></LinkPage>
                      </div>
                    ) : (
                      <>
                        {submitSuccess ? (
                          <LinkPage
                            story={story}
                            storyId={storyId}
                            nextParticipant={nextParticipant}
                          ></LinkPage>
                        ) : (
                          <>
                            <h3 className="text-center">
                              You are the{" "}
                              {1 +
                                story.participants.reduce((acc, curr) => (acc + curr.isSubmitted ? 1 : 0), 0)}
                              /{story.participants.length} editor
                            </h3>

                            <Form className="form-es-false" onSubmit={this.handleSubmit}>
                              <Form.Group>
                                <Form.Label>
                                  Previously on{" "}
                                  <span className="text-capitalize">"{story.storyTitle}"...</span>
                                </Form.Label>
                                <Form.Control
                                  readOnly
                                  as="textarea"
                                  value={hintText}
                                  rows="2"
                                  name="hintText"
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>{validParticipant.email} can continue the story</Form.Label>
                                <Form.Control
                                  required
                                  as="textarea"
                                  placeholder="Continue the adventure..."
                                  rows="10"
                                  name="storyText"
                                  onChange={this.handleChange.bind(this)}
                                />
                              </Form.Group>

                              <Button className="go-btn-cs-false" type="submit">
                                Submit
                              </Button>
                            </Form>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div className="d-flex justify-content-center">
                    Sorry, the edit link for this story is unknown
                  </div>
                )}
              </>
            )}
          </Col>
          <Col sm={2}></Col>
        </Row>
      </div>
    );
  }
}
