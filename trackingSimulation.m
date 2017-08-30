clear; close all; clc;
simulationData = importdata('SimulationData.mat');

% X (meters), Y (meters), ID, Time (Seconds), Species
simulationData = simulationData(:, [2 3 4 5 11]);

% Get cattle data
isCattle = strcmp(table2array(simulationData(:, 5)), 'C');
cattleData = simulationData(isCattle, :);

% Order by time
[timeData, timeOrder] = sort(unique(table2array(cattleData(:, 4))));
cattleData = cattleData(timeOrder, :);

% Center and normalize values
cattleData(:, [1 2]) = array2table(table2array(cattleData(:, [1 2])) - mean(table2array(cattleData(:, [1 2]))));
cattleData(:, 4) = array2table(table2array(cattleData(:, 4)) - min(table2array(cattleData(:, 4))));

% Separate by IDs
uniqueIDs = unique(cattleData(:, 3));
uniqueIDs = table2cell(uniqueIDs);

allCattle = cell(1, size(uniqueIDs, 1));
indexCells = table2cell(cattleData(:,3));
for i = 1 : size(uniqueIDs, 1)
    allCattle{i} = cattleData(strcmp(indexCells, uniqueIDs(i)), :);
end

maxTimePoints = 0;
for i = 1 : length(allCattle)
    if maxTimePoints < size(allCattle{i}, 1)
        maxTimePoints = size(allCattle{i}, 1);
    end
end
% maxTimePoints = 1605

% maxTimePoints = 0;
% for i = 1 : length(allCattle)
%     if maxTimePoints < max(allCattle{i}{:,4})
%         maxTimePoints = max(allCattle{i}{:,4});
%     end
% end
% maxTimePoints = 99812329

% Create Simulation Figure
f = figure;
ax = axes('Parent', f, 'Units', 'normalized', 'position', [0.1 0.1 0.8 0.8]);

xlim([-6000 6000]);
ylim([-3000 7000]);

minTime = min(table2array(cattleData(:,4)));
maxTime = max(table2array(cattleData(:,4)));
title('Cattle Location'), xlabel('X (meters)'), ylabel('Y (meters)');


for i = 1 : length(allCattle)
%     cattleIndex = find(event.AffectedObject.Value - allCattle{1}(:, 4) >= 0, 1, 'last');
    currentPointX = table2array(allCattle{i}(1, 1));
    currentPointY = table2array(allCattle{i}(1, 2));
    plot(currentPointX, currentPointY, '.', 'MarkerSize', 20);
    
    hold on;
end

% Create Slider
slider = uicontrol(f, 'Style', 'slider', ...
    'Min', minTime, 'Max', maxTime, 'Value', minTime, ...
    'SliderStep', [1/size(cattleData, 1) 1/size(cattleData, 1)],  ...
    'units', 'normalized', 'position', [0.1 0.45 0.8 0.5]);

addlistener(slider, 'Value', 'PreSet', @(hObject, event) changeTimePoint(hObject, event, allCattle));
align(slider, 'Center', 'Top');

function changeTimePoint(~, event, allCattle)

    disp(event.AffectedObject.Value);
    cla;
    
    % Get the most recent time point less than the slider value for each cattle    
    xlim([-6000 6000]);
    ylim([-3000 7000]);
    title('Cattle Location'), xlabel('X (meters)'), ylabel('Y (meters)');
    
    for i = 1 : length(allCattle)
        currentCattlePoint = find(event.AffectedObject.Value - table2array(allCattle{i}(:, 4)) >= 0, 1, 'last');
        currentPointX = table2array(allCattle{i}(currentCattlePoint, 1));
        currentPointY = table2array(allCattle{i}(currentCattlePoint, 2));
        
        plot(currentPointX, currentPointY, '.', 'MarkerSize', 20);
        
        hold on;
    end
    
end