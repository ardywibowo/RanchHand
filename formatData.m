clear; close all; clc;
file = fopen('Starkey_OR_Main_Telemetry_1993-1996_Data.txt');
text = fscanf(file, '%c');

newline = char(10);
formattedText = char(zeros(1, length(text)));
for i = 1 : length(text)
    if text(i) == newline
        formattedText(i) = ',';
    else
        formattedText(i) = text(i);
    end
end

formattedText(isspace(formattedText)) = [];

tableColumns = 17;
numRows = ceil(sum(strcmp(formattedText, char(10))/tableColumns));
finalText = char(zeros(1, length(formattedText) + numRows));
commas = 0;
j = 0;
for i = 1 : length(formattedText)
    if strcmp(formattedText(i), ',')
        commas = commas + 1;
    end
    if commas == tableColumns
        finalText(i+j) = formattedText(i);
        j = j+1;
        finalText(i+j) = newline;
        commas = 0;
    else
        finalText(i+j) = formattedText(i);
    end
end

writeFile = fopen('StarkeyFormatted.txt', 'wt');
fprintf(writeFile, '%s', finalText);

simulationData = readtable('StarkeyFormatted.txt');
simulationData = simulationData(:, 1:17);
save('SimulationData.mat', 'simulationData');