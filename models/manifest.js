const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema for collection that stores current manifest version
const manifestSchema = new Schema({
    version: { type: String, unique: false },
    mobileWorldContentPaths: { type: String, unique: false },
});

const ManifestVersion = mongoose.model('ManifestVersion', manifestSchema);
module.exports = ManifestVersion;
