clear; close all; clc;

cattleData = importdata('CattleData.mat');

zone = '11 T';

for i = 1 : height(cattleData)
	[cattleData{i,1}, cattleData{i,2}] = utm2deg(cattleData{i,1}, cattleData{i,2}, zone);
end

cattleData.Properties.VariableNames = {'Latitude' 'Longitude' 'Id' 'StarkeyTime', 'Species'};
save('LatLonData.mat', 'cattleData');

% Separate by IDs
uniqueIDs = unique(cattleData(:, 3));
uniqueIDs = table2cell(uniqueIDs);

allCattle = cell(1, size(uniqueIDs, 1));
indexCells = table2cell(cattleData(:,3));
for i = 1 : size(uniqueIDs, 1)
    allCattle{i} = cattleData(strcmp(indexCells, uniqueIDs(i)), :);
end

for i = 1 : length(allCattle)
	writetable(allCattle{i}, ['ranch-hand/private/csvdata/', cell2mat(allCattle{i}{1,end-2}), '.csv']);
end