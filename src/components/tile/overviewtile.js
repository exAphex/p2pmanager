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
        <div className="pb-2 col-start-4 text-right font-semibold">Total</div>

        <div className="col-start-4 text-right">{this.toCurrencyString(overViewData.total)}</div>

        <div className={"col-start-4 text-right " + (absObj.total >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.total >= 0 ? "+ " : "") + this.toCurrencyString(absObj.total)}</div>
      </div>
    );
  }
}

export default OverviewTile;
