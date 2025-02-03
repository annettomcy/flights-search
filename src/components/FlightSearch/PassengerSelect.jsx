import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Person,
  Remove,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const PASSENGER_TYPES = [
  { id: "adults", label: "Adults", subtitle: null },
  { id: "children", label: "Children", subtitle: "Aged 2-11" },
  { id: "infantsInSeat", label: "Infants", subtitle: "In seat" },
  { id: "infantsOnLap", label: "Infants", subtitle: "On lap" },
];

const STYLES = {
  counter: {
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    transition: "all 0.2s ease",
    "&.Mui-disabled": {
      background: (theme) => theme.palette.action.disabledBackground,
      color: (theme) => theme.palette.action.disabled,
      border: `1px solid #EEEEEE`,
    },
    "&:not(.Mui-disabled)": {
      background: (theme) => theme.palette.background.paper,
      color: (theme) => theme.palette.primary.main,
      border: "1px solid",
      borderColor: (theme) => theme.palette.primary.main,
    },
  },
  passengerType: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    "&:last-child": {
      borderBottom: "none",
    },
  },
};

const PassengerSelect = ({ passengers, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingPassengers, setPendingPassengers] = useState({
    adults: passengers.adults || 1,
    children: passengers.childrens || 0,
    infantsInSeat: passengers.infantsInSeat || 0,
    infantsOnLap: passengers.infantsOnLap || 0,
  });

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPendingPassengers({
      adults: passengers.adults || 1,
      children: passengers.childrens || 0,
      infantsInSeat: passengers.infantsInSeat || 0,
      infantsOnLap: passengers.infantsOnLap || 0,
    });
  };

  const handleClose = () => {
    onChange({
      adults: Math.max(1, pendingPassengers.adults),
      children: pendingPassengers.children,
      infantsInSeat: pendingPassengers.infantsInSeat,
      infantsOnLap: pendingPassengers.infantsOnLap,
    });
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setPendingPassengers({ ...passengers });
    setAnchorEl(null);
  };

  const updatePassengerCount = (type, increment) => {
    setPendingPassengers((prev) => {
      if (type === "adults" && !increment && prev.adults <= 1) {
        return prev;
      }
      return {
        ...prev,
        [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1),
      };
    });
  };

  const getTotalPassengers = ({
    adults = 0,
    children = 0,
    infantsInSeat = 0,
    infantsOnLap = 0,
  }) =>
    Number(adults) +
    Number(children) +
    Number(infantsInSeat) +
    Number(infantsOnLap);

  return (
    <Box>
      <Button
        startIcon={<Person />}
        onClick={handleClick}
        variant="outlined"
        sx={{ justifyContent: "space-between", border: "none" }}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {getTotalPassengers(pendingPassengers)}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { elevation: 4, sx: { width: "300px" } } }}
      >
        <Paper sx={{ p: 2 }}>
          {PASSENGER_TYPES.map(({ id, label, subtitle }) => (
            <Box key={id} sx={STYLES.passengerType}>
              <Box>
                <Typography variant="body1">{label}</Typography>
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => updatePassengerCount(id, false)}
                  disabled={
                    id === "adults"
                      ? pendingPassengers.adults <= 1
                      : pendingPassengers[id] === 0
                  }
                  sx={STYLES.counter}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
                  {pendingPassengers[id]}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updatePassengerCount(id, true)}
                  sx={STYLES.counter}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              onClick={handleClose}
              variant="contained"
              disabled={getTotalPassengers(pendingPassengers) === 0}
            >
              Done
            </Button>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

PassengerSelect.propTypes = {
  passengers: PropTypes.shape({
    adults: PropTypes.number.isRequired,
    children: PropTypes.number,
    childrens: PropTypes.number,
    infantsInSeat: PropTypes.number,
    infantsOnLap: PropTypes.number,
    infants: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PassengerSelect;
