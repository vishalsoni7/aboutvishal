import { useNavigate } from "react-router";

export const About = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="C">
        <div>
          <div className="D">
            <img src="me5.jpg" alt="vishal" title="Me" className="linkedin" />
            <h1>
              <strong> —hi! </strong>
            </h1>
          </div>
        </div>
        <div className="E">
          <p className="P">
            I'm an ex-civil engineer who made a career transition to become a
            passionate <br /> React web developer. I was born and raised in
            Rajasthan and have been fortunate <br /> to embark on an exciting
            journey of exploring various aspects of web development.
          </p>
          <p className="P">
            I love to solve problems and create user friendly web apps.
          </p>
          <p className="P"> Browse through my latest projects,</p>
          <div className="D">
            <span className="link" onClick={() => navigate("/projects")}>
              {" "}
              work⤼
            </span>
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
