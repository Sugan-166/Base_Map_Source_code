// Load the Global 30m Digital Elevation Model (DEM) dataset
var dataset = ee.ImageCollection('COPERNICUS/DEM/GLO30');

// Select the DEM band from the dataset
var elevation = dataset.select('DEM');

// Set visualization parameters for the elevation layer
var elevationVis = {
  min: 0.0, // Minimum elevation value
  max: 1000.0, // Maximum elevation value
  palette: ['0000ff', '00ffff', 'ffff00', 'ff0000', 'ffffff'], // Color palette for elevation
};

// Center the map on a specific location (longitude, latitude) and set zoom level
Map.setCenter(-6.746, 46.529, 4);

// Add the elevation layer to the map with visualization parameters
Map.addLayer(elevation, elevationVis, 'DEM');

// Optional: Masking areas with no data (if applicable)
var maskedElevation = elevation.updateMask(elevation.neq(0)); // Mask out zero values

// Add the masked elevation layer to the map
Map.addLayer(maskedElevation, elevationVis, 'Masked DEM');

// Calculate statistics for the elevation data
var stats = elevation.reduceRegion({
  reducer: ee.Reducer.mean(), // Change to another reducer for different statistics
  geometry: Map.getBounds(true), // Use the current map bounds
  scale: 30, // Scale in meters (adjust according to the dataset's resolution)
  maxPixels: 1e9 // Increase max pixels if needed
});

// Print statistics to the console
print('Elevation Statistics:', stats);

// Optional: Export the elevation data as GeoTIFF
Export.image.toDrive({
  image: maskedElevation,
  description: 'Exported_DEM',
  scale: 30, // Specify scale for export
  region: Map.getBounds(true), // Export the current map bounds
  maxPixels: 1e9 // Increase if needed
});
