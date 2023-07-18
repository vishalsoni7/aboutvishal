import { NavLink } from "react-router-dom/dist";

export const Home = () => {
  return (
    <div>
      <div>
        <NavLink to="/">
          {" "}
          <img src="logo.svg" alt="logo" className="logo-img" />{" "}
        </NavLink>
        <div className="A">
          {" "}
          <span>
            {" "}
            <NavLink className="NavLink" to="/">
              {" "}
              HOME{" "}
            </NavLink>{" "}
          </span>
          <span>
            <NavLink className="NavLink" to="/about">
              {" "}
              ABOUT{" "}
            </NavLink>
          </span>{" "}
        </div>
        <div className="B">
          {" "}
          <h1>
            — Hi, I'm Vishal Soni. I'm an React <br /> Web Developer, who loves
            to develop <br /> imaginative apps and joyful experiences.
          </h1>
          <span>
            {" "}
            <i>All work © Vishal Soni </i>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};
