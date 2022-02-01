import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as PresaleContract } from "../abi/Presale.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "../helpers/NodeHelper";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContract,
      provider,
    );
    const percentReleased = await presaleContract.getPercentReleased();
    const isList = await presaleContract.isList();
    const isPresaleOpen = await presaleContract.isPresaleOpen();
    const maxBusdLimit = await presaleContract.maxBusdLimit();
    const minBusdLimit = await presaleContract.minBusdLimit();
    const rate = await presaleContract.rate();
    const price = 1000000000 / rate;
    const totalTokenAmountToDistribute = await presaleContract.totalpTokenAmountToDistribute();
    

    return {
      percentReleased,
      isList,
      isPresaleOpen,
      maxBusdLimit,
      minBusdLimit,
      price,
      totalTokenAmountToDistribute,
    } as IPresaleData;
  },
);


interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly oldfiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly old_stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
  readonly endBlock?: number;
  readonly runway?: number;
}

interface IPresaleData {
  readonly percentReleased: number;
  readonly isList: boolean;
  readonly isPresaleOpen: boolean;
  readonly maxBusdLimit: number;
  readonly minBusdLimit: number;
  readonly price: number;
  readonly totalTokenAmountToDistribute: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
