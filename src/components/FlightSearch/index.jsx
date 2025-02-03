import { SwapHoriz } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { searchAirports, searchFlights } from "../../api/flightApi";
import {
  CABIN_CLASS,
  DEFAULT_FLIGHT_SEARCH_PARAMS,
  TRIP_TYPES,
} from "../../constants";
import AirportSearch from "../common/AirportSearch";
import CustomDropdown from "../common/CustomDropdown";
import DateSelect from "../common/DateSelect";
import PassengerSelect from "../common/PassengerSelect";

const FlightSearch = ({ onSearch }) => {
  const [tripType, setTripType] = useState("one_way");
  const [searchParams, setSearchParams] = useState(
    DEFAULT_FLIGHT_SEARCH_PARAMS
  );
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState({
    origin: {
      open: false,
      anchorEl: null,
      searchValue: "",
      results: [],
      selected: null,
    },
    destination: {
      open: false,
      anchorEl: null,
      searchValue: "",
      results: [],
      selected: null,
    },
  });
  const [isSearching, setIsSearching] = useState({
    origin: false,
    destination: false,
  });

  const updateLocation = (type, updates) => {
    setLocations((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...updates },
    }));
  };

  const handleLocationSelect = (type, location) => {
    const otherType = type === "origin" ? "destination" : "origin";
    if (locations[otherType].selected?.skyId === location.skyId) {
      updateLocation(otherType, {
        selected: null,
        open: false,
        anchorEl: null,
        searchValue: "",
      });
      setSearchParams((prev) => ({
        ...prev,
        [`${otherType}SkyId`]: "",
        [`${otherType}EntityId`]: "",
      }));
    }
    updateLocation(type, {
      selected: location,
      open: false,
      anchorEl: null,
    });
    setSearchParams((prev) => ({
      ...prev,
      [`${type}SkyId`]: location.skyId,
      [`${type}EntityId`]: location.entityId,
    }));
  };

  const handlePassengerChange = ({
    adults,
    children,
    infantsInSeat,
    infantsOnLap,
  }) => {
    setSearchParams((prev) => ({
      ...prev,
      adults,
      childrens: children,
      infants: (infantsInSeat || 0) + (infantsOnLap || 0),
    }));
  };

  const handleCabinClassChange = (cabinClass) => {
    setSearchParams((prev) => ({
      ...prev,
      cabinClass,
    }));
  };

  useEffect(() => {
    const fetchLocations = async (type, searchValue) => {
      if (!searchValue) {
        updateLocation(type, { results: [] });
        return;
      }
      try {
        setIsSearching((prev) => ({ ...prev, [type]: true }));
        const data = await searchAirports(searchValue);
        updateLocation(type, { results: data || [] });
      } catch (error) {
        console.error(`Error fetching ${type} locations:`, error);
        updateLocation(type, { results: [] });
      } finally {
        setIsSearching((prev) => ({ ...prev, [type]: false }));
      }
    };

    const timeoutId = setTimeout(() => {
      if (locations.origin.searchValue) {
        fetchLocations("origin", locations.origin.searchValue);
      }
      if (locations.destination.searchValue) {
        fetchLocations("destination", locations.destination.searchValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locations.origin.searchValue, locations.destination.searchValue]);

  const handleDateChange = ({ startDate, endDate }) => {
    setSearchParams((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleSearch = async () => {
    if (tripType === "round_trip" && !searchParams.endDate) {
      alert("Please select a return date for round trip.");
      return;
    }
    try {
      setLoading(true);
      onSearch({ loading: true });

      const results = await searchFlights(searchParams);
      onSearch({ loading: false, ...results });
    } catch (error) {
      console.error("Error searching flights:", error);
      onSearch({ loading: false, error });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (type) => (event) => {
    updateLocation(type, {
      open: true,
      anchorEl: event.currentTarget,
      searchValue: locations[type].selected?.presentation?.title || "",
    });
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        boxShadow: 1,
        width: "100%",
        p: { xs: 1, sm: 2 },
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <CustomDropdown
          options={TRIP_TYPES}
          defaultValue={tripType}
          showIcons={true}
          onChange={setTripType}
          sx={{ width: "auto", minWidth: 150 }}
        />
        <PassengerSelect
          passengers={searchParams}
          onChange={handlePassengerChange}
        />
        <CustomDropdown
          options={CABIN_CLASS}
          defaultValue={searchParams.cabinClass}
          onChange={handleCabinClassChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <AirportSearch
          open={locations.origin.open}
          anchorEl={locations.origin.anchorEl}
          onClose={() =>
            updateLocation("origin", { open: false, anchorEl: null })
          }
          onClick={handleClick("origin")}
          searchValue={locations.origin.searchValue}
          onSearchChange={(value) =>
            updateLocation("origin", { searchValue: value })
          }
          locations={locations.origin.results}
          selectedLocation={locations.origin.selected}
          onLocationSelect={(location) =>
            handleLocationSelect("origin", location)
          }
          placeholderText="Where from?"
          sx={{ width: { xs: "100%", sm: "auto" } }}
          isLoading={isSearching.origin}
        />
        <IconButton
          onClick={() => {
            const originData = locations.origin.selected;
            const destinationData = locations.destination.selected;
            updateLocation("origin", {
              selected: destinationData,
              searchValue: destinationData?.presentation?.title || "",
              open: false,
              anchorEl: null,
            });
            updateLocation("destination", {
              selected: originData,
              searchValue: originData?.presentation?.title || "",
              open: false,
              anchorEl: null,
            });
            setSearchParams((prev) => ({
              ...prev,
              originSkyId: destinationData?.skyId || "",
              originEntityId: destinationData?.entityId || "",
              destinationSkyId: originData?.skyId || "",
              destinationEntityId: originData?.entityId || "",
            }));
          }}
          sx={{
            display: { xs: "none", sm: "flex" },
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "action.hover" },
            boxShadow: 1,
          }}
        >
          <SwapHoriz />
        </IconButton>
        <AirportSearch
          open={locations.destination.open}
          anchorEl={locations.destination.anchorEl}
          onClose={() =>
            updateLocation("destination", { open: false, anchorEl: null })
          }
          onClick={handleClick("destination")}
          searchValue={locations.destination.searchValue}
          onSearchChange={(value) =>
            updateLocation("destination", { searchValue: value })
          }
          locations={locations.destination.results}
          selectedLocation={locations.destination.selected}
          onLocationSelect={(location) =>
            handleLocationSelect("destination", location)
          }
          placeholderText="Where to?"
          sx={{ width: { xs: "100%", sm: "auto" } }}
          isLoading={isSearching.destination}
        />
        <DateSelect
          tripType={tripType}
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
          onChange={handleDateChange}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={
            loading ||
            !searchParams.originSkyId ||
            !searchParams.destinationSkyId ||
            !searchParams.startDate
          }
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? "Searching..." : "Search Flights"}
        </Button>
      </Box>
    </Box>
  );
};

FlightSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default FlightSearch;
