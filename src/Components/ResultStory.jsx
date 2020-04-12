import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { db } from "./../config/firebaseConfig";

export default class ResultStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      story: {},
      isUnfold: false,
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
      let hintText = story.storyParts.reduce((acc, part) => acc + part.text + " ", "");
      if (hintText.length > 200) hintText = hintText.substring(hintText.length - 100, hintText.length - 1);
      // check that secret is valid
      const validParticipant = story.participants.filter(
        (participant) => participant.secret && this.state.secret === participant.secret
      );
      this.setState({ story, isLoading: false, hintText, validParticipant });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      this.setState({ error: true });
    }
  }

  render() {
    const { isUnfold } = this.state;
    const { nextLink, nextParticipant } = this.props;

    return (
      <div>
        <div className="d-flex flex-column justify-content-center align-items-center mt-3">
          {
            <>
              <h1 className="h1-cs-true">Thank you!</h1>
              {isUnfold && (
                <>
                  <p>Succesfully copied!</p>
                </>
              )}
              <CopyToClipboard
                className="clipboard"
                text={nextLink}
                onCopy={() => this.setState({ isUnfold: true })}
              >
                <span>
                  <Row className="row-cs-true p-3">
                    <p className="mr-5 my-auto copy-cs-true">Copy Link</p>
                    <img src="assets/images/copy.png" />
                  </Row>
                </span>
              </CopyToClipboard>
              <p className="p-5 p-cs-true text-center">
                Copy link and send it to <strong>{nextParticipant.email}</strong>. Soon you'll get the whole
                story!
              </p>
            </>
          }
        </div>
      </div>
    );
  }
}
