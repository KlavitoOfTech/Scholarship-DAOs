const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ScholarshipDAOModule", (m) => {
  const scholarshipDAO = m.contract("ScholarshipDAO");
  return { scholarshipDAO };
});
