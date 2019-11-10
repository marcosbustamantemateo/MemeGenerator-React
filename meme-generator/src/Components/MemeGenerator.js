import React, { Component } from "react";

class MemeGenerator extends Component {
  constructor() {
    super();

    this.state = {
      allMemeImgs: [],
      memeSelected: {},
      words: [],
      urlMeme: ''
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

  openModal = meme => {
    this.setState({ memeSelected: meme });
    console.log(meme);
    this.getModal().style.display = "block";
  };

  closeModal = () => {
    this.getModal().style.display = "none";
  };

  closeModalByClickOut = () => {
    window.onclick = event => {
      if (event.target === this.getModal()) {
        this.getModal().style.display = "none";
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

  handleSubmit(event) {
    const { memeSelected, words } = this.state;
    event.preventDefault();

    fetch(
      "https://api.imgflip.com/caption_image?template_id=" +
        memeSelected.id +
        "&username=MarcosBustamante&password=meme1234&" +
        "text0=" + words[0] + "&text1=" + words[1],
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded"
        })
      }
    )
      .then(response => response.json())
      .then(response => this.setState({ url: response.data.url }));
  }

  render() {
    const { allMemeImgs, memeSelected } = this.state;

    return (
      <div>
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={this.closeModal}>
              &times;
            </span>
            <h2>{memeSelected.name}</h2>
            <div className="imgModalContainer">
              <img src={memeSelected.url} alt={memeSelected.name} />
            </div>
            <div className="formModalContainer">
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
            </div>
          </div>
        </div>

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
