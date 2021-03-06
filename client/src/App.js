import React, { useState, useEffect } from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { PrivateRoute } from "./utils/PrivateRoute";
import { axiosWithAuth } from "./utils/axiosWithAuth";
import { UserContext } from "./contexts/UserContext";
import { BoardContext } from "./contexts/BoardContext";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Board from "./components/Board";
import Articles from "./components/Articles";
import articles from "./assets/data.json"

import logo from "./assets/logo.png";
import { Button } from "@material-ui/core";
import "./App.css";

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const history = useHistory();

  // user info
  useEffect(() => {
    if (loggedin) {
      axiosWithAuth()
        .get("/users/myinfo")
        .then(res => {
          setUserInfo(res.data);
          history.push("/dashboard")
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [loggedin, history]);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedin(false);
  };

  // boards
  const [boards, setBoards] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false)

  const fetchBoards = () => {
    axiosWithAuth()
        .get("/boards/boards")
        .then((res) => {
          setBoards(res.data)
          setIsUpdated(false)
        })
        .catch((err) => console.log(err.response));
  };

  useEffect(() => {
      fetchBoards();
  }, [isUpdated]);

  const addArticles = (board, article) => {
    axiosWithAuth()
      .post("/articles/article", {
        title: JSON.stringify(article.title),
        description: JSON.stringify(article.description),
        url: JSON.stringify(article.url),
        author: JSON.stringify(article.author),
        urlToImage: JSON.stringify(article.urlToImage),
        boards: [{...board, board: { boardid: board.boardid }}],
    })
      .then((res) => {
        fetchBoards();
        setIsUpdated(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <UserContext.Provider value={{ userInfo, setLoggedin }}>
      <BoardContext.Provider value = {{ boards, setBoards, fetchBoards, isUpdated, setIsUpdated, articles, addArticles }}>
        <div className="gradient">
          <div className="gradient-2" />
          <div className="gradient-3" />
        </div>
        <div className="App">
          <nav className="App-header">
            <div className="navbar-left">
              <img src={logo} alt="logo" className="logo" />
              <h1 style={{ marginLeft:"15px" }}>Pintreach</h1>
            </div>
            {loggedin ? (
              <div className="navbar-right">
                <Button id="btn3">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </Button>
                 <Button id="btn3">
                  <Link to="/articles" className="nav-link">
                    Articles
                  </Link>
                </Button>
                {/* <Button id="btn3">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </Button> */}
                <Button id="btn3" onClick={logout}>
                  <Link className="nav-link">
                    Logout
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="navbar-right">
                <Button id="btn3">
                  <Link to="/" className="nav-link">
                    Login
                  </Link>
                </Button>
                <Button id="btn3">
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          <Switch>
            <Route exact path="/" render={props => <Login setLoggedin={setLoggedin} />}  />
            <Route exact path="/signup" component={SignUp} />
            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/board/:boardid" component={Board} />
            <PrivateRoute exact path="/articles" component={Articles} />
          </Switch>
        </div>
      </BoardContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
