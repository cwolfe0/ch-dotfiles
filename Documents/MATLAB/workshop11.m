f = @(x) cos(3*x)/(x+1);
I_exact = 0.085472789;
I1 = trap(f,0,pi,1) % Trap n = 1
I2 = trap(f,0,pi,2) % Trap n=2 
I12 = 4/3*I2-1/3*I1 % O(h^4) 
I4 = trap(f,0,pi,4) % Trap n=4 
I24 = 4/3*I4-1/3*I2 % O(h^4) 
I124 = 16/15*I24-1/15*I12 % O(h^6) 
I8 = trap(f,0,pi,8) % Trap n=8 
I48 = 4/3*I8-1/3*I4 % O(h^4) 
I248 = 16/15*I48-1/15*I24 % O(h^6) 
I1248 = 64/63*I248-1/63*I124 % O(h^8) 
