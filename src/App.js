import moment from "moment";
import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import "./App.scss";
import LocationIcon from "./assets/icons/location.svg";
import SearchIcon from "./assets/icons/search.svg";
import ImageComponent from "./ImageComponent";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      data: null,
      days: null,
      currentDay: null,
      chartData: {
        labels: [
          "Boston",
          "Worcester",
          "Springfield",
          "Lowell",
          "Cambridge",
          "New Bedford",
        ],
        datasets: [
          {
            data: [617594, 181045, 153060, 106519, 105162, 95072],

            lineTension: 0.25,
            fill: false,
            borderColor: "lightblue",

            pointBorderColor: "lightblue",
            pointBackgroundColor: "white",
            borderDash: [],
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: "rectRounded",
          },
        ],
      },
    };
  }
  componentDidMount() {
    this.getLocation();
  }
  byCity(cityName) {
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=e3b248023441205c44963ae49d6e8724&units=metric&mode=json`;
    this.getData(url);
  }

  getLocation = () => {
    fetch("http://ip-api.com/json")
      .then((res) => res.json())
      .then((result) => {
        let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${result.lat}&lon=${result.lon}&appid=e3b248023441205c44963ae49d6e8724&units=metric&mode=json`;
        this.getData(url);
      });
  };

  getData(url) {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          let list = [];
          let chartXAxesLabels = [];
          let xTempArray = [];

          for (let i = 0; i < result.list.length; ) {
            list.push(result.list[i]);
            i = i + 8;
          }
          for (let i = 0; i <= 4; i++) {
            let xTime = moment(result.list[i].dt_txt).format("hha");
            let xTemp = result.list[i].main.temp;

            xTempArray.push(xTemp);
            chartXAxesLabels.push(xTemp + "° " + xTime);
          }
          this.setState({
            data: result,
            days: [...list],
            currentDay: result.list[0],
            chartData: {
              labels: [...chartXAxesLabels],
              datasets: [
                {
                  data: [...xTempArray],
                },
              ],
            },
          });
        },
        (error) => {
          alert("Some Error Occured! check console for error");
          console.log(error);
        }
      );
  }

  handleSearch = ({ target: { value } }) => {
    console.log("handle search");
    this.setState({
      searchQuery: value,
    });
  };
  handleButtonClick = () => {
    console.log("button clicked", this.state.searchQuery);
    this.byCity(this.state.searchQuery);
  };

  render() {
    return (
      <section>
        {/* INPUT */}
        <div className="input-wrapper box-with-shadow">
          <div className="left-block">
            <img src={LocationIcon} alt="location-icon" />
            <input
              type="text"
              placeholder="City"
              value={this.state.searchQuery}
              onChange={(event) => this.handleSearch(event)}
            />
          </div>
          <button type="button" onClick={this.handleButtonClick}>
            <img src={SearchIcon} alt="search-icon" />
          </button>
        </div>
        {/* /INPUT */}

        {/* DAYS */}
        <div className="days">
          {this.state.days &&
            this.state.days.map((item) => {
              return (
                <div className="day" key={item.dt}>
                  <h6>{moment(item.dt_txt.substring(0, 10)).format("ddd")}</h6>
                  <h5>
                    {item.main.temp_max.toString().substring(0, 2)}&deg;
                    <span>
                      {item.main.temp_min.toString().substring(0, 2)}&deg;
                    </span>
                  </h5>
                  <ImageComponent type={item.weather[0].description} />
                  <p>{item.weather[0].main}</p>
                </div>
              );
            })}
        </div>
        {/* /DAYS */}

        {/* DAY INFO */}

        {this.state.currentDay && this.state.chartData && (
          <div className="day-info box-with-shadow br-6">
            <div className="title">
              <h1>
                {this.state.currentDay.main.temp.toString().substring(0, 2)}
                &#8451;
              </h1>

              <ImageComponent
                type={this.state.currentDay.weather[0].description}
              />
            </div>

            <Line
              data={this.state.chartData}
              options={{
                layout: {
                  padding: 10,
                },

                title: {
                  display: false,
                },
                legend: {
                  display: false,
                  labels: {
                    fontSize: 80,
                  },
                },
                ticks: {
                  display: false,
                },

                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontSize: 8,
                        fontColor: "black",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: false,
                    },
                  ],
                },
              }}
            ></Line>
            <div className="more-info">
              <span>
                <h5>Pressure</h5>
                <h6>{this.state.currentDay.main.pressure} hpa</h6>
              </span>
              <span>
                <h5>Humidity</h5>
                <h6>{this.state.currentDay.main.humidity} %</h6>
              </span>
            </div>

            {/* SUNRISE AND SET  */}
            <div className="more-info sun-rise-set">
              <span>
                <h5>Sunrise</h5>
                <h6>7.30am</h6>
              </span>
              <span>
                <h5>Sunset</h5>
                <h6>6.00pm</h6>
              </span>
            </div>
          </div>
          // SUNRISE AND SET END
        )}
      </section>
    );
  }
}

export default App;
