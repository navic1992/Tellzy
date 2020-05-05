import React, { Component, useRef, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import "../styling/landing.css";
const quotes = require("../styling/quotes.json");

export default class Landing extends Component {
  render() {
    function quoteGen() {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    const finalQuote = quoteGen();

    return (
      <>
        <Row className="first-part">
          <Col md className=""></Col>
          <Col md={7}>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img className="sm-show" src="/assets/images/logo-white-gradient.png"></img>
              <div className="wrap text-left">
                <h1 className="h1 sm-hide">Tellzy</h1>

                <h3 className="h3-landing text-left">collective storytelling.</h3>
                <h3 className="h3-landing text-left">share your imagination.</h3>
                <h3 className="h3-landing text-left">simple & exciting.</h3>
              </div>
              <div className="landing-quote sm-hide">
                <i> {finalQuote.text} </i> <br />
                <p className="text-right">
                  <b>{finalQuote.author}</b>
                </p>
              </div>
              <h1 className="text-center sm-show mobile-h1">Tellzy</h1>
            </div>
          </Col>
          <Col md className=""></Col>
        </Row>
        <Row className="second-part">
          <Col md className="mt-auto text-right">
            <Button className="sm-hide" onClick={() => scroll.scrollToTop()}>
              Up
            </Button>
          </Col>
          <Col
            md={7}
            name="scroll-aim"
            className="text-center d-flex flex-column align-items-center justify-content-center col-color"
          >
            <Row id="how-to" className="how-to">
              <div className="d-flex flex-column justify-content-start">
                <div className="text-center d-flex flex-row justify-content-center align-items-center">
                  <h2 className="caveat-font mb-4">HOW TO</h2>
                </div>
                <Row className="howto">
                  <div className="d-flex align-items-center text-left mobile-column inner-div">
                    <img className="illustration-width sm-show" src="/assets/images/pen.png"></img>
                    <img className="sm-hide" src="/assets/images/pen-high.png"></img>
                    <div className="inner-div">
                      <h3 className="caveat-font">
                        <b>What is Tellzy? </b>
                      </h3>
                      <br /> Tellzy is a <b>collective story-writing game</b>, i.e. you are writing a story
                      together with your friends. Each of you is continuing this story{" "}
                      <b>one after another.</b>
                    </div>
                  </div>
                </Row>
                <Row className="howto">
                  <div className="d-flex align-items-center mobile-column text-left inner-div">
                    <div className="inner-div">
                      <h3 className="caveat-font">
                        <b>Get started! </b>
                      </h3>
                      <br /> <b>Create your personal author profile</b>, start a new story and invite your
                      friends. Keep in mind, that
                      <b> every one of you needs to be a registered author </b>
                      to continue the story.
                    </div>
                    <img className="" src="/assets/images/note.png"></img>
                  </div>
                </Row>
                <Row className="howto">
                  <div className="d-flex align-items-center text-left mobile-column inner-div">
                    <img src="/assets/images/house.png"></img>
                    <div className="inner-div">
                      <h3 className="caveat-font">
                        <b>Good Thing takes time</b>
                      </h3>
                      <br />
                      According to our experience it <b>takes a while</b> until all authors finish their
                      parts. Meanwhile, stay informed about the
                      <b> story progress</b> in your profile.
                    </div>
                  </div>
                </Row>
                <Row className="howto">
                  <div className="d-flex align-items-center text-left mobile-column inner-div ">
                    <div className="inner-div ml-4">
                      <h3 className="caveat-font">
                        <b>Grand Finale </b>
                      </h3>
                      <br />
                      Once the story is finished, everybody is excited about the result.{" "}
                      <b>Share the Story</b> with your co-authors and your friends!
                    </div>
                    <img className="" src="/assets/images/friends.png"></img>
                  </div>
                </Row>

                <div className="mt-4 sm-hide">
                  <Link to="/policy">Policy & Impressum</Link>
                </div>
              </div>
            </Row>
          </Col>
          <Col md className="mt-auto">
            <>
              <Link to="/story" onClick={this.handleShow}>
                <Button>New Story</Button>
              </Link>
              <div className="mt-5 text-center sm-show">
                <Link to="/policy">Policy & Impressum</Link>
              </div>
            </>
          </Col>
        </Row>
      </>
    );
  }
}
