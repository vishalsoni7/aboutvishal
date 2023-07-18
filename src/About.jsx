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
            <h1>
              {" "}
              <strong> — hi! </strong>{" "}
            </h1>
          </div>
        </div>

        <div className="E">
          <p className="P">
            {" "}
            I'm an ex-civil engineer who is now a React web developer, I was
            born and raised in Rajasthan, <br /> where I’ve been so fortunate
            and trying to do so many incredible new things in web development.
          </p>
          <p className="P">
            I love to solve problems and create user friendly web apps.
          </p>
          <p className="P"> Browse through my latest projects</p>{" "}
          <div className="D">
            {" "}
            <a
              className="link"
              href="https://pixyverse.netlify.app/"
              target="-blank"
            >
              {" "}
              social-media-app pixyverse{" "}
            </a>
            <a
              className="link"
              href="https://jewellss.netlify.app/"
              target="-blank"
            >
              {" "}
              e-commerce-app jewels{" "}
            </a>{" "}
          </div>
        </div>
      </div>
      <span className="C-span">
        {" "}
        <i>All work © Vishal Soni </i>{" "}
      </span>
    </div>
  );
};
