import { CalendarMonth } from "@mui/icons-material";
import { Box, Button, Popover } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STYLES = {
  button: {
    border: "none",
    justifyContent: "space-between",
    minWidth: "150px",
  },
  datePickerWrapper: {
    "& .react-datepicker": {
      fontFamily: "inherit",
    },
    "& .react-datepicker__input-container input": {
      width: "100%",
      height: "100%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
    },
  },
};

const DateSelect = ({ tripType, startDate, endDate, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (dates) => {
    if (tripType === "round_trip") {
      const [start, end] = dates;
      onChange({ startDate: start, endDate: end });
      if (start && end) handleClose();
    } else {
      onChange({ startDate: dates, endDate: null });
      handleClose();
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getButtonText = () => {
    if (!startDate) return "Select date";
    if (tripType === "round_trip" && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return formatDate(startDate);
  };

  return (
    <Box sx={STYLES.datePickerWrapper}>
      <Button
        onClick={handleClick}
        variant="outlined"
        startIcon={<CalendarMonth />}
        sx={STYLES.button}
      >
        {getButtonText()}
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
            sx: { p: 2 },
          },
        }}
      >
        <DatePicker
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          minDate={new Date()}
          selectsRange={tripType === "round_trip"}
          monthsShown={tripType === "round_trip" ? 2 : 1}
          inline
        />
      </Popover>
    </Box>
  );
};

DateSelect.propTypes = {
  tripType: PropTypes.oneOf(["one_way", "round_trip"]).isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

export default DateSelect;
