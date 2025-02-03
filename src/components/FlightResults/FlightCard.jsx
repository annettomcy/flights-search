import {
  AccessTime,
  FlightLand,
  FlightTakeoff,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

import Logo from "../common/Logo";
import LayoverSection from "./LayoverSection";

const FlightCard = ({ itinerary }) => {
  const [expanded, setExpanded] = useState(false);
  const leg = itinerary.legs[0];

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Logo
              url={leg.carriers.marketing[0].logoUrl}
              name={leg.carriers.marketing[0].name}
            />
            <Box sx={{ minWidth: 0 }}>
              {" "}
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                {leg.timeDeltaInDays > 0 && <sup> +{leg.timeDeltaInDays}</sup>}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {leg.carriers.marketing[0].name}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 3, sm: 2 },
              width: "100%",
              justifyContent: { xs: "space-between", sm: "flex-end" },
              mt: { xs: 1, sm: 0 },
              borderTop: { xs: "1px solid #eee", sm: "none" },
              pt: { xs: 2, sm: 0 },
            }}
          >
            <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {formatDuration(leg.durationInMinutes)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {leg.origin.displayCode}-{leg.destination.displayCode}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {leg.stopCount} stop{leg.stopCount !== 1 ? "s" : ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {leg.segments[0].destination.displayCode}
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: { xs: "auto", sm: 2 },
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                noWrap
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: 600,
                }}
              >
                {itinerary.price.formatted}
              </Typography>
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{
                  transform: expanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              >
                <KeyboardArrowDown />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          {itinerary.legs.map((leg) => (
            <Box key={leg.id}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Flight Details */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightTakeoff color="action" />
                      <Typography variant="body1">
                        {formatTime(leg.departure)} · {leg.origin.city} (
                        {leg.origin.displayCode})
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        my: 1,
                      }}
                    >
                      <AccessTime color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(leg.durationInMinutes)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightLand color="action" />
                      <Typography variant="body1">
                        {formatTime(leg.arrival)} · {leg.destination.city} (
                        {leg.destination.displayCode})
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" color="text.secondary">
                      {leg.stopCount === 0
                        ? "Direct"
                        : `${leg.stopCount} stop${
                            leg.stopCount > 1 ? "s" : ""
                          }`}
                    </Typography>
                  </Box>
                </Box>

                {/* Layover Section */}
                {leg.stopCount > 0 && (
                  <Box sx={{ pl: 4 }}>
                    <LayoverSection segments={leg.segments} />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );
};

FlightCard.propTypes = {
  itinerary: PropTypes.shape({
    id: PropTypes.string,
    price: PropTypes.shape({
      formatted: PropTypes.string,
    }),
    legs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        carriers: PropTypes.shape({
          marketing: PropTypes.arrayOf(
            PropTypes.shape({
              logoUrl: PropTypes.string,
              name: PropTypes.string,
            })
          ),
        }),
        durationInMinutes: PropTypes.number,
        stopCount: PropTypes.number,
        segments: PropTypes.array,
        origin: PropTypes.shape({
          displayCode: PropTypes.string,
          city: PropTypes.string,
        }),
        destination: PropTypes.shape({
          displayCode: PropTypes.string,
          city: PropTypes.string,
        }),
        departure: PropTypes.string,
        arrival: PropTypes.string,
        timeDeltaInDays: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default FlightCard;
