clear; close all; clc;

triangulationData = importdata('TriangulationData.mat');
timePoints = importdata('TimePoints.mat');
allSensors = importdata('SensorLocations.mat');

allCattle = cell(length(triangulationData), 1);
error = 0;
for i = 1 : 1
	currentTimePoint = triangulationData(:, i);
	
	notEmpty = find(~cellfun(@isempty, currentTimePoint));
	currentTimePoint = currentTimePoint(notEmpty);
	
	% Separate by cattle ID.
	currentCattle = cell(0);
	for j = 1 : length(currentTimePoint)
		currentSensorData = currentTimePoint{j};
		currentDistance = currentSensorData{1};
		currentID = currentSensorData{2};
		
		unique = 1;
		for k = 1 : length(currentCattle)
			if strcmp(currentID, currentCattle{k, 2}) == 1
				unique = 0;
				break;
			end
		end
		
		if unique == 1
			currentCattle = [currentCattle; currentSensorData, notEmpty(j)]; %#ok
		else
			currentCattle{k, 1} = [currentCattle{k, 1}, currentDistance];
			currentCattle{k, 3} = [currentCattle{k, 3}, notEmpty(j)];
		end
	end
	
	% Perform triangulation
	for l = 1 : size(currentCattle, 1)
		cow = currentCattle{l, 1};
		sensors = currentCattle{l, 3};
		
		center = [0, 0];
		distanceFunction = cell(length(sensors), 1);
		trueDistance = cell(length(sensors), 1);
		for m = 1 : length(sensors)
			currentSensor = allSensors(sensors(m), :);
			xSensor = currentSensor(1);
			ySensor = currentSensor(2);
			
			noise = 100*randn;
			distanceFunction{m} = @(x) ((cow(m)+noise)^2 - ((x(1) - xSensor)^2 + (x(2) - ySensor)^2))^2;
% 			trueDistance{m} = @(x) ((cow(m))^2 - ((x(1) - xSensor)^2 + (x(2) - ySensor)^2))^2;
			
			center = center + currentSensor/cow(m);
			
			circle(xSensor, ySensor, cow(m) + noise);
		end
		
		center = center * mean(cow)/length(sensors);
		
		totalFunction = @(x) 0;
% 		trueFunction = @(x) 0;
		for m = 1 : length(distanceFunction)
			totalFunction = @(x) totalFunction(x) + distanceFunction{m}(x);
% 			trueFunction = @(x) trueFunction(x) + trueDistance{m}(x);
		end
		
		% Use Levenberg-Marqurdt Algorithm for fitting
		options.Algorithm = 'levenberg-marquardt';
		options.OptimalityTolerance = 10^-6;
		options.Display = 'off';
		x = lsqnonlin(totalFunction, center, [], [], options);
% 		xTrue = lsqnonlin(trueFunction, center, [], [], options);
% 		error = error + norm(x-xTrue, 2);
		
		axis equal;
		scatter(x(1), x(2));
	end
% 	disp(i);
	allCattle{i} = currentCattle;
end

% error = error/1000;
% disp(error);

function circle(x,y,r)
%x and y are the coordinates of the center of the circle
%r is the radius of the circle
%0.01 is the angle step, bigger values will draw the circle faster but
%you might notice imperfections (not very smooth)
ang=0:0.01:2*pi; 
xp=r*cos(ang);
yp=r*sin(ang);
plot(x+xp,y+yp);

hold on;
end