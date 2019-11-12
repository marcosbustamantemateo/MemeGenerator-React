import React, { Component } from "react";
import Tooltip from "rc-tooltip";
// import ShareButtons from "./ShareButtons";

const copyIcon = require("./../Images/copy.png");

class MemeGenerator extends Component {
  constructor() {
    super();

    this.state = {
      allMemeImgs: [],
      memeSelected: {},
      words: [],
      urlMeme: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const box_count = 2;

    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => {
        const { memes } = response.data;
        this.setState({
          allMemeImgs: memes.filter(item => item["box_count"] === box_count)
        });
      });

    this.closeModalByClickOut();
  }

  copy = inputName => {
    const input = document.getElementById(inputName);
    input.select();
    document.execCommand("copy");
  };

  openModal = meme => {
    this.setState({ memeSelected: meme });
    this.getModal().style.display = "block";
  };

  closeModal = () => {
    this.getModal().style.display = "none";
    this.reset();
  };

  closeModalByClickOut = () => {
    window.onclick = event => {
      if (event.target === this.getModal()) {
        this.getModal().style.display = "none";
        this.reset();
      }
    };
  };

  getModal = () => {
    return document.getElementById("myModal");
  };

  handleChange = (i, event) => {
    let words = [...this.state.words];
    words[i] = event.target.value;
    this.setState({ words });
  };

  reset = () => {
    this.setState({ urlMeme: undefined, words: [] });
  };

  handleSubmit = event => {
    const { memeSelected, words } = this.state;
    event.preventDefault();

    if (words.length === 2) {
      fetch(
        "https://api.imgflip.com/caption_image?template_id=" +
          memeSelected.id +
          "&username=MarcosBustamante&password=meme1234&" +
          "text0=" +
          words[0] +
          "&text1=" +
          words[1],
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        }
      )
        .then(response => response.json())
        .then(response => {
          this.setState({ urlMeme: response.data.url });
        });
    }
  };

  image = (url, name) => {
    return (
      <div className="imgModalContainer">
        <img src={url} alt={name} />
      </div>
    );
  };

  modal = (memeSelected, url) => {
    return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.closeModal}>
            &times;
          </span>

          <h2>{memeSelected.name}</h2>

          {url === undefined
            ? this.image(memeSelected.url, memeSelected.name)
            : this.image(url, memeSelected.name)}
          <div className="formModalContainer">
            {url === undefined ? (
              <React.Fragment>
                <h4 style={{ fontSize: "25px" }}>Complete all fields</h4>
                <form onSubmit={this.handleSubmit}>
                  {memeSelected.box_count !== undefined
                    ? Array.from(Array(memeSelected.box_count)).map(
                        (element, index) => {
                          return (
                            <div key={index}>
                              <span>Text {index + 1}</span>{" "}
                              <input
                                type="text"
                                onChange={this.handleChange.bind(this, index)}
                              />
                              <br />
                            </div>
                          );
                        }
                      )
                    : null}
                  <input type="submit" value="Do it!" />
                </form>
              </React.Fragment>
            ) : (
              <div className="shareModalContainer">
                <p>Image Link</p>
                <input id="url" type="text" value={url} readOnly />{" "}
                  <img
                    src={copyIcon}
                    alt="copy icon"
                    className="iconCopy"
                    onClick={() => this.copy("url")}
                  />
                
                <p>Html code</p>
                <input
                  id="html"
                  type="text"
                  value={
                    '<a href="' +
                    url +
                    '"/><img src="' +
                    url +
                    '" alt="meme_image" /></a>'
                  }
                  readOnly
                />{" "}
                <img
                  src={copyIcon}
                  alt="copy icon"
                  className="iconCopy"
                  onClick={() => this.copy("html")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { allMemeImgs, memeSelected, urlMeme } = this.state;

    return (
      <div>
        {this.modal(memeSelected, urlMeme)}

        <div className="memesContainer">
          {allMemeImgs.map(element => {
            return (
              <div className="memeImg" key={element.id}>
                <img
                  src={element.url}
                  alt={element.name}
                  onClick={() => this.openModal(element)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MemeGenerator;
