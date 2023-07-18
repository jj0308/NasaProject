const launchesModel = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await launchesModel.getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function addNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await launchesModel.addNewLaunch(launch);
  return res.status(201).json(launch);
}
async function abortLaunchById(req, res) {
  const launchId = Number(req.params.id);

  if (!launchesModel.existsLaunchWithId(launchId)) {
    // Call it from launchesModel
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const aborted = await launchesModel.abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
