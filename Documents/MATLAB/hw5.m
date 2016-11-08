% Cory Wolfe
%% Question 1
t = 0:2; dydt = @(t,y) (1-4*t)^2*sqrt(y);
%a.
tx = linspace(0,2);
yx = (1/36)*(-16*tx.^3+12*tx.^2-3*tx+1).^2;
%b.
[te5, ye5] = eulode(dydt, [0 2], 1, .5)
[te25, ye25] = eulode(dydt, [0 2], 1, .25)
%c.
[tm,ym]=heun(dydt, [0 2], 1, .5,[])
%d.
h = .5; i = 1;
y = zeros(3,1); y(1) =1;
k1 = dydt(t(i),y(i));
k2 = dydt(t(i)+0.5*h,y(i)+0.5*k1*h);
k3 = dydt(t(i)+0.5*h,y(i)+0.5*k2*h);
k4 = dydt(t(i)+h,y(i)+k3*h);
phi = (k1+2*k2+2*k3+k4)/6; 
y(i+1) = y(i) + phi*h ;
i=2;
k1 = dydt(t(i),y(i));
k2 = dydt(t(i)+0.5*h,y(i)+0.5*k1*h);
k3 = dydt(t(i)+0.5*h,y(i)+0.5*k2*h);
k4 = dydt(t(i)+h,y(i)+k3*h);
phi = (k1+2*k2+2*k3+k4)/6; 
y(i+1) = y(i) + phi*h 
plot(tx,yx,te5,ye5,'bx',te25,ye25,'o',t,y,'rx',tm,ym,'bo')
%% Question 2