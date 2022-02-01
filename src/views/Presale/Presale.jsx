import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeDeposit } from "../../slices/PresaleThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./presale.scss";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

function Presale() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const price = useSelector(state => {
    return state.app.price;
  });
  console.log("debug price", price);
  const busdBalance = useSelector(state => {
    return state.account.balances && state.account.balances.busd;
  });
  const setMax = () => {
    setQuantity(busdBalance);
  };
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const presaleAllowance = useSelector(state => {
    return state.account.presale && state.account.presale.presaleAllowance;
  });
  const onChangeDeposit = async action => {

    await dispatch(changeDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };
  const hasAllowance = useCallback(
    token => {
      if (token === "busd") return presaleAllowance > 0;
      return 0;
    },
    [presaleAllowance],
  );
  const isAllowanceDataLoading = presaleAllowance == null;
  return (
    <div id="dashboard-view">
      {/* <div className="presale-header" style={{color: "#ff0000"}}>
        <h1>Eliminate</h1>
        <p>Whitelist is needed for this presale!</p>
      </div> */}
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">¡Llegaron Los Reyes!</Typography>
              <p> {address} </p>
            </div>
          </Grid>
          <Grid item>
            <div className="stake-top-metrics">
              <Typography className="presale-items">Para redimir tus 8 NFTs de Regalo de Reyes, presiona:</Typography>
              <div style={{justifyContent: "center", display: "flex"}}>
                <Button
                          className="stake-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "claiming")}
                          style={{marginTop: "16px", alignItems: "center"}}
                          onClick={() => {
                            onChangeDeposit("claim");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "claiming", "REDIMIR")}
                </Button>
              </div>
            </div>
          </Grid>
          {/* <Grid item>
            <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
              <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                {address && !isAllowanceDataLoading ? (
                  !hasAllowance("busd") ? (
                    <Box className="help-text">
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        <>
                          First time deposit <b>BUSD</b>?
                          <br />
                          Please approve OctaNode to use your <b>BUSD</b> for presale.
                        </>
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box item xs={12} sm={6} md={6} lg={6}>
                        <FormControl className="ohm-input" variant="outlined" color="primary">
                          <InputLabel htmlFor="amount-input"></InputLabel>
                          <OutlinedInput
                            id="amount-input"
                            type="number"
                            placeholder="Enter an amount"
                            className="stake-input"
                            value={quantity}
                            width="100%"
                            onChange={e => setQuantity(e.target.value)}
                            labelWidth={0}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button variant="text" onClick={setMax} color="inherit">
                                  Max
                                </Button>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Box>
                    </>
                  )
                ) : (
                  <Skeleton width="35%" />
                )}

                {isAllowanceDataLoading ? (
                  <Skeleton width="35%" />
                ) : address && hasAllowance("busd") ? (
                  <>
                    <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                      <Typography style={{marginTop: "16px"}}>1 $OCTA = 5 $BUSD</Typography>
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "deposit")}
                        style={{marginTop: "16px"}}
                        onClick={() => {
                          onChangeDeposit("presale");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "deposit", "BUY")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box>
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      disabled={isPendingTxn(pendingTransactions, "approve_deposit")}
                      onClick={() => {
                        onSeekApproval("busd");
                      }}
                    >
                      {txnButtonText(pendingTransactions, "approve_deposit", "Approve")}
                    </Button>
                  </Box>
                )}
              </Box>
            </div>
          </Grid> */}
        </Grid>
      </Paper>
    </div>
  );
}

export default Presale;
