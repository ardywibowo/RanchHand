function [ mappedX ] = minMaxMap(X)
%MINMAXMAP Maps a data matrix into the interval [-1,1] where -1 represents
%the minimum value of a row and 1 representing the maximum value of a row

mappedX = zeros(size(X));

for i = 1:size(X, 1)
	maxRow = max(X(i,:));
	minRow = min(X(i,:));
	
	center = (maxRow + minRow)/2;
	mappedX(i,:) = X(i,:) - center;
	mappedX(i,:) = mappedX(i,:) ./ abs(max(mappedX(i,:)));
	
end

end

