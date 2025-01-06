import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoundDetails } from "@/functions";
import { Container, Card, CardContent, Typography, Button, Grid, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import { CheckCircle, PlayArrow, PauseCircle, ArrowBack } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const RoundPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(null);
  const [game, setGame] = useState(null);
  const [participant, setParticipant] = useState(null);
  const { gameId, roundId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoundDetails = async () => {
      try {
        const response = await getRoundDetails(roundId);
        if (response?.success) {
          setRound(response.round);
          setGame(response.game);
          setParticipant(response.participant);
        } else {
          console.log("Failed to load round details.");
        }
      } catch (error) {
        console.error("Error fetching round details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoundDetails();
  }, [roundId]);

  if (loading) return <Typography variant="h6" align="center">{t('loading')}</Typography>;
  if (!round) return <Typography variant="h6" align="center">{t('roundDetailsNotFound')}</Typography>;

  const levels = game?.levels || [];
  const participantLevels = participant?.levels || [];

  const getLevelStatus = (levelNumber) => {
    const participantLevel = participantLevels.find(
      (l) => l.levelNumber === levelNumber
    );
    if (participantLevel) {
      const answeredQuestions = participantLevel.answers.length;
      const totalQuestions = levels.find(
        (lvl) => lvl.levelNumber === levelNumber
      )?.numberOfQuestions;

      if (answeredQuestions === totalQuestions) {
        return t('completed');
      }
      return t('inProgress');
    }
    return t('notStarted');
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar with Back Button */}
      <AppBar position="static" sx={{ backgroundColor: "#3498db" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBack />
          </IconButton>
          {/* Removed roundId, no longer displaying */}
        </Toolbar>
      </AppBar>

      <Container fluid sx={{ padding: 4, backgroundColor: '#ecf0f1', direction: 'rtl', flexGrow: 1 }}>
        {levels.length > 0 ? (
          <Grid container spacing={3}>
            {levels.map((level) => {
              const status = getLevelStatus(level.levelNumber);
              const isCompleted = status === t('completed');

              return (
                <Grid item xs={12} md={6} lg={4} key={level._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: 3,
                      background: isCompleted
                        ? "linear-gradient(145deg, #2ecc71, #27ae60)"
                        : "linear-gradient(145deg, #f39c12, #f1c40f)",
                      boxShadow: 5,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ color: "#34495e" }}>
                        {t('level')} {level.levelNumber}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        <strong>{t('difficulty')}:</strong> {t(level.difficulty.toLowerCase())}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        <strong>{t('questions')}:</strong> {level.numberOfQuestions}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>{t('status')}:</strong>{" "}
                        <span className={isCompleted ? "text-white" : "text-dark"}>
                          {status}
                        </span>
                      </Typography>
                    </CardContent>

                    {!isCompleted && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ display: "flex", alignItems: "center" }}
                          onClick={() =>
                            navigate(`/game/${gameId}/round/${roundId}/level/${level.levelNumber}`)
                          }
                        >
                          {status === t('inProgress') ? (
                            <>
                              <PauseCircle sx={{ mr: 1 }} />
                              {t('resume')}
                            </>
                          ) : (
                            <>
                              <PlayArrow sx={{ mr: 1 }} />
                              {t('start')}
                            </>
                          )}
                        </Button>
                      </Box>
                    )}

                    {isCompleted && (
                      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
                        <CheckCircle sx={{ fontSize: 40, color: "white" }} />
                      </Box>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">{t('noLevelsAvailable')}</Typography>
        )}
      </Container>
    </Box>
  );
};

export default RoundPage;
