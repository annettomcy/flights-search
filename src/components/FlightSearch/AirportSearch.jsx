import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const buttonSx = {
  color: "inherit",
  justifyContent: "space-between",
  minWidth: "150px",
  border: "1px solid",
  borderColor: "grey.300",
  borderRadius: 1,
  textTransform: "none",
  px: 2,
};

const popoverSx = {
  paper: {
    sx: {
      width: 400,
      mt: 1,
    },
  },
};

const AirportSearch = ({
  open,
  anchorEl,
  onClose,
  onClick,
  searchValue,
  onSearchChange,
  locations = [],
  selectedLocation,
  onLocationSelect,
  placeholderText = "Select location",
  isLoading = false,
}) => {
  const getIcon = (entityType) =>
    entityType === "AIRPORT" ? <FlightIcon /> : <LocationOnIcon />;

  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    if (location?.presentation?.title) {
      onSearchChange(location.presentation.title);
    }
    onClose();
  };

  return (
    <>
      <Button
        onClick={onClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={buttonSx}
      >
        {selectedLocation?.presentation?.title || placeholderText}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={popoverSx}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search locations"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: isLoading && (
                  <CircularProgress size={20} color="inherit" />
                ),
              },
            }}
          />
        </Box>

        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {locations.length > 0 ? (
            locations.map((location) => (
              <ListItemButton
                key={location.navigation.entityId}
                onClick={() => handleLocationSelect(location)}
              >
                <ListItemIcon>
                  {getIcon(location.navigation.entityType)}
                </ListItemIcon>
                <ListItemText
                  primary={location.presentation.suggestionTitle}
                  secondary={location.presentation.subtitle}
                />
              </ListItemButton>
            ))
          ) : searchValue && !isLoading ? (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              No locations found
            </Box>
          ) : null}
        </List>
      </Popover>
    </>
  );
};

AirportSearch.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      navigation: PropTypes.shape({
        entityId: PropTypes.string.isRequired,
        entityType: PropTypes.string.isRequired,
      }).isRequired,
      presentation: PropTypes.shape({
        title: PropTypes.string,
        suggestionTitle: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
      }).isRequired,
    })
  ),
  selectedLocation: PropTypes.object,
  onLocationSelect: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default AirportSearch;
