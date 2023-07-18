export const About = () => {
  return (
    <div>
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
            I'm an ex-civil engineer who made a career transition to become{" "}
            <br /> a passionate React web developer. I was born and raised in
            Rajasthan and have been <br /> fortunate to embark on an exciting
            journey of exploring various aspects of web development.
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
              pixyverse a social-media-app
            </a>
            <a
              className="link"
              href="https://jewellss.netlify.app/"
              target="-blank"
            >
              {" "}
              jewels a e-commerce-app
            </a>{" "}
          </div>
        </div>
      </div>
      <span className="C-span">
        <i>All work © Vishal Soni </i>{" "}
      </span>
    </div>
  );
};
