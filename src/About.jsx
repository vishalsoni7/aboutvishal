import { NavLink } from "react-router-dom/dist";

export const About = () => {
  return (
    <div>
      <div>
        {" "}
        <NavLink to="/">
          {" "}
          <img
            width="100"
            height="100"
            src="logo.svg"
            alt="logo"
            className="logo-img"
          />{" "}
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
      </div>
      <div className="C">
        <div>
          {" "}
          <div className="D">
            {" "}
            <img src="me2.jpg" alt="vishal" className="me" />
            <h1 className="h1-shadow">
              {" "}
              <strong> — hi! </strong>{" "}
            </h1>
          </div>
        </div>

        <div>
          <p className="P">
            {" "}
            I was born and raised in Rajasthan, and I’m now a web developer
            based in Bhilwara <br /> where I’ve been so so fortunate to have
            been able to work on so many incredible things.
          </p>
          <p className="P">I love to solve problems and learn new things.</p>
        </div>
      </div>
      <span className="C-span">
        {" "}
        <i>All work © Vishal Soni </i>{" "}
      </span>
    </div>
  );
};
