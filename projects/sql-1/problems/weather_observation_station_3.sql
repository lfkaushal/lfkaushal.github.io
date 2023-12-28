-- https://www.hackerrank.com/challenges/weather-observation-station-3/problem

SELECT DISTINCT city FROM station WHERE mod(id,2)=0;