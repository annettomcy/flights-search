import {
  KeyboardArrowDown as ArrowDownIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

const CustomDropdown = ({
  options,
  onChange,
  defaultValue,
  label = "Select",
  showIcons = false,
  minWidth = 250,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0]?.value || ""
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
    handleClose();
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );
  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<ArrowDownIcon />}
        startIcon={
          showIcons && selectedOption?.icon ? (
            React.isValidElement(selectedOption.icon) ? (
              selectedOption.icon
            ) : (
              <selectedOption.icon />
            )
          ) : null
        }
        variant="outlined"
        sx={{
          textTransform: "none",
          justifyContent: "space-between",
          px: 2,
          border: "none",
        }}
      >
        {selectedOption?.label || label}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: minWidth,
              mt: 1,
            },
          },
        }}
      >
        <List sx={{ p: 0 }}>
          {options.map((option) => (
            <ListItem
              key={option.value}
              onClick={() => !option.disabled && handleSelect(option.value)}
              sx={{
                cursor: option.disabled ? "not-allowed" : "pointer",
                "&:hover": {
                  backgroundColor: option.disabled ? "inherit" : "action.hover",
                },
                opacity: option.disabled ? 0.5 : 1,
              }}
            >
              <ListItemText primary={option.label} />
              {selectedValue === option.value && (
                <CheckIcon
                  sx={{
                    ml: 1,
                    color: "primary.main",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  showIcons: PropTypes.bool,
  minWidth: PropTypes.number,
};

export default CustomDropdown;
