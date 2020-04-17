import React, { Component, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { db } from "./../config/firebaseConfig";
import ShareButton from "react-web-share-button";
import LinkWithCopy from "./Reusable/LinkWithCopy";

export default class ResultStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      story: {},
      nextUnfold: false,
      storyUnfold: false,
      isDesktop: window.innerWidth > 700,
    };

    this.nextSetUnfold = this.nextSetUnfold.bind(this);
    this.storySetUnfold = this.storySetUnfold.bind(this);
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.updatePredicate);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  };

  updatePredicate = () => {
    this.setState({ isDesktop: window.innerWidth > 700 }); //this has something toDo with the Screensize and the Sharebutton I guess?
  };

  nextSetUnfold() {
    if (!this.state.nextUnfold) this.setState({ nextUnfold: true });

    if (this.state.storyUnfold) this.setState({ storyUnfold: false });
  }

  storySetUnfold() {
    if (!this.state.storyUnfold) this.setState({ storyUnfold: true });

    if (this.state.nextUnfold) this.setState({ nextUnfold: false });
  }

  render() {
    const { story, storyId, nextParticipant } = this.props;
    const { nextUnfold, storyUnfold, isDesktop } = this.state;

    const storyLink = `https://tellzy.web.app/story/${storyId}`;
    let nextLink = null;
    if (nextParticipant) nextLink = `https://tellzy.web.app/story/${storyId}/${nextParticipant.secret}`;

    return (
      <div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          {
            <>
              {nextParticipant ? (
                <>
                  <p className="p-cs-true text-center mt-3">
                    Send
                    <span className="highlight"> {nextParticipant.email} </span>
                    this
                    <span className="highlight"> Edit Link </span>
                    to continue the adventure!
                  </p>
                  <Row className="d-flex justify-content-center align-items-center">
                    {!isDesktop ? (
                      <>
                        <ShareButton
                          url={nextLink}
                          text={`"${story.storyTitle}" continues...\n`}
                          buttonText="Share"
                          buttonStyle={{
                            backgroundColor: "#f8a055",
                            borderColor: "#f8a055",
                            borderRadius: "5px",
                            fontSize: "2rem",
                            padding: ".8rem",
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 10,
                            },
                            shadowOpacity: 0.51,
                            shadowRadius: 13.16,
                          }}
                          title={`Tellzy is awesome`}
                        ></ShareButton>
                      </>
                    ) : (
                      <>
                        <LinkWithCopy
                          link={nextLink}
                          text="Edit Link"
                          isUnfold={nextUnfold}
                          setUnfold={this.nextSetUnfold}
                        ></LinkWithCopy>
                      </>
                    )}
                  </Row>

                  <p className="p2-cs-true2 text-center">
                    Soon you will get the whole story! <br />
                    In the meantime, track the status on this <b>Result</b> Link
                  </p>

                  <LinkWithCopy
                    link={storyLink}
                    text="Result Link"
                    isUnfold={storyUnfold}
                    setUnfold={this.storySetUnfold}
                  ></LinkWithCopy>
                </>
              ) : (
                <>
                  <p className="p-5 p-cs-true text-center">
                    Your Tellzy story is complete! Now you can share it with your buddies:
                    <br />
                    <span className="highlight">
                      {story.participants.map((participant) => participant.email).join(", ")}
                    </span>
                  </p>
                  {!isDesktop ? (
                    <ShareButton
                      url={storyLink}
                      text={`"${story.storyTitle}" is finished!`}
                      buttonText="Share"
                      buttonStyle={{
                        backgroundColor: "#f8a055",
                        borderColor: "#f8a055",
                        borderRadius: "5px",
                        fontSize: "2rem",
                        padding: ".8rem",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 10,
                        },
                        shadowOpacity: 0.51,
                        shadowRadius: 13.16,
                      }}
                      title={`Tellzy is awesome`}
                    ></ShareButton>
                  ) : (
                    <LinkWithCopy
                      link={storyLink}
                      text="Result Link"
                      isUnfold={storyUnfold}
                      setUnfold={this.storySetUnfold}
                    ></LinkWithCopy>
                  )}

                  {/* <LinkWithCopy link={storyLink} text="Result Link"></LinkWithCopy> */}
                </>
              )}
            </>
          }
        </div>
      </div>
    );
  }
}
