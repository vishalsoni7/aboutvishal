import { NavLink } from "react-router-dom/dist";
export const Header = () => {
  return (
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
  );
};
