import React from "react";
import OverviewTileLine from "./overviewtileline";

class OverviewTile extends React.Component {
  render() {
    return (
      <div className="shadow p-4 grid grid-cols-5">
        <div className="pb-2 col-start-1"></div>
        <div className="text-right font-semibold">Last 24 hours</div>
        <div className="text-right font-semibold">Last week</div>
        <div className="text-right font-semibold">Last month</div>
        <div className="text-right font-semibold">Last year</div>

        <OverviewTileLine name="Total" accounts={this.props.accounts} property="total"></OverviewTileLine>
      </div>
    );
  }
}

export default OverviewTile;
