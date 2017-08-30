clear; close all; clc;
simulationData = importdata('SimulationData.mat');

% X (meters), Y (meters), ID, Time (Seconds), Species
simulationData = simulationData(:, [2 3 4 5 11]);

% Get cattle data
isCattle = strcmp(table2array(simulationData(:, 5)), 'C');
cattleData = simulationData(isCattle, :);

% Center and normalize values
cattleData(:, [1 2]) = array2table(table2array(cattleData(:, [1 2])) - mean(table2array(cattleData(:, [1 2]))));
cattleData(:, 4) = array2table(table2array(cattleData(:, 4)) - min(table2array(cattleData(:, 4))));

% Order by time
[timeData, timeOrder] = sort(unique(table2array(cattleData(:, 4))));
cattleData = cattleData(timeOrder, :);

% Separate by IDs
uniqueIDs = unique(cattleData(:, 3));
uniqueIDs = table2cell(uniqueIDs);

allCattle = cell(1, size(uniqueIDs, 1));
indexCells = table2cell(cattleData(:,3));
for i = 1 : size(uniqueIDs, 1)
    allCattle{i} = cattleData(strcmp(indexCells, uniqueIDs(i)), :);
end

% Find maximum time points
maxTimePoints = 0;
for i = 1 : length(allCattle)
    if maxTimePoints < size(allCattle{i}, 1)
        maxTimePoints = size(allCattle{i}, 1);
    end
end

% Place Sensors
xLocations = table2array(cattleData(:, 1));
yLocations = table2array(cattleData(:, 2));

allSensorAmounts = zeros(20, 1);
for senseAmt = 100 : 100 : 2000


sensorRange = senseAmt; % meters

% Rough estimate of sensor amount
sensorAmount = ceil((max(xLocations) - min(xLocations)) * (max(yLocations) - min(yLocations)) / (sqrt(3)*3/2 * sensorRange^2));

% First Layer Sensors
firstLayerSensors = zeros(sensorAmount, 2);
odd = 1;
i = 1;
for x = min(xLocations) : 3/2*sensorRange : max(xLocations)
	if odd
		allY = min(yLocations) : sqrt(3)*sensorRange : max(yLocations);
	else
		allY = min(yLocations) - sqrt(3)/2 * sensorRange : sqrt(3)*sensorRange : max(yLocations) + sqrt(3)/2 * sensorRange;
	end
	
	for y = allY
		firstLayerSensors(i, :) = [x y];
		i = i + 1;
	end
	odd = ~odd;
end

% Second Layer Sensors
secondLayerSensors = zeros(sensorAmount, 2);
odd = 1;
i = 1;
for x = min(xLocations) + sensorRange/2 : 3/2*sensorRange : max(xLocations) + sensorRange/2
	if odd
		allY = min(yLocations) - sqrt(3)/2 * sensorRange : sqrt(3)*sensorRange : max(yLocations) + sqrt(3)/2 * sensorRange;
	else
		allY = min(yLocations) : sqrt(3)*sensorRange : max(yLocations);
	end
	
	for y = allY
		secondLayerSensors(i, :) = [x y];
		i = i + 1;
	end
	odd = ~odd;
end

% Third Layer Sensors
thirdLayerSensors = secondLayerSensors - [sensorRange * ones(length(secondLayerSensors), 1) zeros(length(secondLayerSensors), 1)];
allSensors = [firstLayerSensors; secondLayerSensors; thirdLayerSensors];

allSensorAmounts(senseAmt/100) = length(allSensors);

end

% Show sensor placement figure
figure;
hold on;
scatter(thirdLayerSensors(:, 1), thirdLayerSensors(:, 2), sensorRange*3);
scatter(secondLayerSensors(:, 1), secondLayerSensors(:, 2), sensorRange*3);
scatter(firstLayerSensors(:, 1), firstLayerSensors(:, 2), sensorRange*3);
axis equal;
title(['Sensor Locations ', num2str(sensorRange), ' meters']);
xlabel('X (meters)'), ylabel('Y (meters)');

% Compute triangulation simulation data
% timeDataOrder = [timeData timeOrder];
% sensorData = cell(length(allSensors), length(timeData));
% for i = 1 : length(allSensors)
% 	currentSensor = allSensors(i, :);
% 	for j = 1 : length(allCattle)
% 		currentCattle = allCattle{j};
% 		cattleLocationTime = table2array(currentCattle(:, [1 2 4]));
% 		cattleID = table2cell(currentCattle(1, 3));
% 		for k = 1 : length(cattleLocationTime)
% 			currentTime = cattleLocationTime(k, 3);
% 			index = find(currentTime == timeDataOrder(:, 1));
% 			timeIndex = timeDataOrder(index, 2);
% 			
% 			% Calculate distance from cow to sensor
% 			xDistance = currentSensor(1) - cattleLocationTime(k, 1);
% 			yDistance = currentSensor(2) - cattleLocationTime(k, 2);
% 			
% 			distance = sqrt(xDistance^2 + yDistance^2);
% 			if distance <= sensorRange
% 				% Add to sensor data list
% 				sensorData{i, timeIndex} = [sensorData{i, timeIndex}; {distance, cattleID}];
% 			end
% 		end
% 	end
% end
% 
% save('TriangulationData.mat', 'sensorData');
% save('SensorLocations.mat', 'allSensors');
% save('TimePoints.mat', 'timeData');


%% Old Code

% Generates triangulation data in a different format (sensors - cows)

% Generate triangulation simulation data
% sensorData = cell(length(allSensors), length(allCattle));
% for i = 1 : length(allSensors)
% 	for j = 1 : length(allCattle)
% 		% Find distance between sensors and cattle for all time points
% 		currentCattle = allCattle{j};
% 		cattleLocationTime = table2array(currentCattle(:, [1 2 4]));
% 		currentSensor = allSensors(i, :);
% 		
% 		n = 1;
% 		for k = 1 : length(cattleLocationTime)
% 			xDistance = currentSensor(1) - cattleLocationTime(k, 1);
% 			yDistance = currentSensor(2) - cattleLocationTime(k, 2);
% 			
% 			distance = sqrt(xDistance^2 + yDistance^2);
% 			
% 			if distance <= sensorRange
% 				% Add to sensor data list
% 				sensorData{i, j}{n} = [distance cattleLocationTime(k, 3)];
% 				n = n + 1;
% 			end
% 		end
% 	end
% end