import { useNavigate } from "react-router-dom/dist";
export const Header = () => {
  const navigate = useNavigate();
  return (
    <div>
      <img src="logo.svg" alt="logo" className="logo-img" />
      <div className="A">
        <span onClick={() => navigate("/")}>HOME</span>
        <span onClick={() => navigate("/about")}>ABOUT </span>
      </div>
    </div>
  );
};
