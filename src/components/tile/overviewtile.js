import React from "react";
import { getCategoryByType } from "../../utils/utils";
import GenericTile from "./generictile";

class OverviewTile extends GenericTile {
  constructor(props) {
    super(props);
  }

  render() {
    var overViewData = this.calculateAbsoluteProperty(this.props.accounts);
    var deltaDay = this.getDeltaDay(this.props.deltaOption);
    var deltaObj = this.getDeltaDayValue(this.props.accounts, deltaDay);
    var absObj = this.getDeltaAbsoluteValue(deltaObj, overViewData);
    return (
      <div className="shadow p-4 grid grid-cols-7">
        <div className="pb-2 col-start-1 text-right font-semibold">Total</div>

        <div className="text-right font-semibold">Invested</div>
        <div className="text-right font-semibold">Uninvested</div>
        <div className="text-right font-semibold">Loss</div>
        <div className="text-right font-semibold">Profit</div>

        <div className="text-right font-semibold">Staked</div>
        <div className="text-right font-semibold">Rewards</div>

        <div className="col-start-1 text-right">{this.toCurrencyString(overViewData.total)}</div>

        <div className="text-right ">{this.toCurrencyString(overViewData.invested)}</div>
        <div className="text-right ">{this.toCurrencyString(overViewData.uninvested)}</div>
        <div className="text-right ">{this.toCurrencyString(overViewData.loss)}</div>
        <div className="text-right ">{this.toCurrencyString(overViewData.profit)}</div>

        <div className="text-right ">{this.toCurrencyString(overViewData.staked)}</div>
        <div className="text-right ">{this.toCurrencyString(overViewData.rewards)}</div>

        <div className={"col-start-1 text-right " + (absObj.total >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.total >= 0 ? "+ " : "") + this.toCurrencyString(absObj.total)}</div>

        <div className={"text-right " + (absObj.invested >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.invested >= 0 ? "+ " : "") + this.toCurrencyString(absObj.invested)}</div>
        <div className={"text-right " + (absObj.uninvested >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.uninvested >= 0 ? "+ " : "") + this.toCurrencyString(absObj.uninvested)}</div>
        <div className={"text-right " + (absObj.loss >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.loss >= 0 ? "+ " : "") + this.toCurrencyString(absObj.loss)}</div>
        <div className={"text-right " + (absObj.profit >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.profit >= 0 ? "+ " : "") + this.toCurrencyString(absObj.profit)}</div>

        <div className={"text-right " + (absObj.staked >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.staked >= 0 ? "+ " : "") + this.toCurrencyString(absObj.staked)}</div>
        <div className={"text-right " + (absObj.rewards >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.rewards >= 0 ? "+ " : "") + this.toCurrencyString(absObj.rewards)}</div>
      </div>
    );
  }
}

export default OverviewTile;
