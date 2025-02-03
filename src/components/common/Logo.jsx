import { Avatar } from "@mui/material";
import PropTypes from "prop-types";

const Logo = ({ url, name, width = 32, height = 32 }) => {
  return <Avatar src={url} alt={name} sx={{ width: width, height: height }} />;
};

Logo.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Logo;
