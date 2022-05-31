import { CgClose, CgMenu } from "react-icons/cg";

const MobileMenu = ({ toggle, handleClick }) => {
  console.log(handleClick);
  return (
    <button onClick={handleClick}>
      {toggle ? <CgClose size={22} /> : <CgMenu size={22} />}
    </button>
  );
};

export default MobileMenu;
