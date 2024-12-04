from manim import *
import numpy as np

class AnimationClass(Scene):
    def __init__(self):
        """Initialize the AnimationClass."""
        super().__init__()
        
    def add_circle(self, radius: float, color: str):
        """Create and return a circle with specified radius and color. And add it to the scene.
        
        Args:
            radius (float): The radius of the circle
            color (str): The color of the circle
            
        Returns:
            Circle: A Manim Circle object
        """
        circle = Circle(radius=radius, color=color)
        self.add(circle)
        return circle

    def add_rectangle(self, width: float, height: float, color: str):
        """Create and return a rectangle with specified dimensions and color. And add it to the scene.
        
        Args:
            width (float): The width of the rectangle
            height (float): The height of the rectangle
            color (str): The color of the rectangle
            
        Returns:
            Rectangle: A Manim Rectangle object 
        """
        rectangle = Rectangle(width=width, height=height, color=color)
        self.add(rectangle)
        return rectangle

    def remove_object(self, object: VMobject):
        """Remove an object from the scene.
        
        Args:
            object (VMobject): The Manim object to remove
        """
        self.remove(object)

    def add_line(self, start: tuple[float, float, float], end: tuple[float, float, float], color: str):
        """Create and return a line with specified start point, end point and color. And add it to the scene.
        
        Args:
            start (tuple[float, float, float]): The starting coordinates (x, y, z)
            end (tuple[float, float, float]): The ending coordinates (x, y, z)
            color (str): The color of the line
            
        Returns:
            Line: A Manim Line object
        """
        line = Line(start=start, end=end, color=color)
        self.add(line)
        return line

    def linear_motion(self, 
                     obj: VMobject,
                     initial_pos: tuple[float, float, float],
                     initial_vel: tuple[float, float, float],
                     acceleration: tuple[float, float, float],
                     duration: float,
                     ):
        """Animate an object with linear motion using kinematics equations.
        
        Args:
            obj (VMobject): The object to animate
            initial_pos (tuple[float, float, float]): Initial position coordinates (x, y, z)
            initial_vel (tuple[float, float, float]): Initial velocity components (vx, vy, vz)
            acceleration (tuple[float, float, float]): Acceleration components (ax, ay, az)
            duration (float): The duration of the animation
        """
        self.play(LinearMotion(obj, initial_pos=initial_pos, initial_vel=initial_vel, 
                             acceleration=acceleration, run_time=duration))

   
    def pendulum_motion(self, obj:VMobject, length:float, initial_angle:float, duration:float):
        """Animate an object in pendulum motion.
        
        Args:
            obj (VMobject): The object to animate
            length (float): The length of the pendulum
            initial_angle (float): The starting angle in radians
            duration (float): The duration of the animation
        """
        self.play(PendulumMotion(obj, length=length, initial_angle=initial_angle, run_time=duration))
    
    def circular_motion(self, obj:VMobject, radius:float, angular_velocity:float, duration:float):
        """Animate an object in circular motion.
        
        Args:
            obj (VMobject): The object to animate
            radius (float): The radius of the circular path
            angular_velocity (float): The angular velocity in radians per second
            duration (float): The duration of the animation
        """
        self.play(CircularMotion(obj, radius=radius, angular_velocity=angular_velocity, run_time=duration))
        
    def align_objects_horizontally(self, obj1: VMobject, obj2: VMobject, spacing: float = 0):
        """Align two objects horizontally with optional spacing between them.
        
        Args:
            obj1 (VMobject): The first object (reference object)
            obj2 (VMobject): The second object to align
            spacing (float): Optional spacing between objects (default: 0)
        """
        # Get the right edge of obj1 and set obj2's left edge to that position plus spacing
        obj2.next_to(obj1, RIGHT, buff=spacing)

    def align_objects_vertically(self, obj1: VMobject, obj2: VMobject, spacing: float = 0):
        """Align two objects vertically with optional spacing between them.
        
        Args:
            obj1 (VMobject): The first object (reference object)
            obj2 (VMobject): The second object to align
            spacing (float): Optional spacing between objects (default: 0)
        """
        # Get the bottom edge of obj1 and set obj2's top edge to that position plus spacing
        obj2.next_to(obj1, DOWN, buff=spacing)

    def center_align_objects(self, obj1: VMobject, obj2: VMobject):
        """Align the centers of two objects.
        
        Args:
            obj1 (VMobject): The first object (reference object)
            obj2 (VMobject): The second object to align
        """
        obj2.move_to(obj1.get_center())

class LinearMotion(Animation):
    def __init__(self, 
                 mobject: VMobject,
                 initial_pos: tuple[float, float, float],
                 initial_vel: tuple[float, float, float],
                 acceleration: tuple[float, float, float],
                 **kwargs) -> None:
        """Initialize LinearMotion animation.
        
        Args:
            mobject (VMobject): The object to animate
            initial_pos (tuple[float, float, float]): Initial position (x, y, z)
            initial_vel (tuple[float, float, float]): Initial velocity (vx, vy, vz)
            acceleration (tuple[float, float, float]): Acceleration vector (ax, ay, az)
            **kwargs: Additional animation parameters
        """
        super().__init__(mobject, **kwargs)
        self.initial_pos = list(initial_pos)
        self.initial_vel = list(initial_vel)
        self.acceleration = list(acceleration)
        
    def interpolate_mobject(self, alpha: float) -> None:
        """Update the position of the object at each animation frame.
        
        Args:
            alpha (float): Animation progress from 0 to 1
        """
        # Calculate current time based on alpha
        t = alpha * self.run_time
        
        # Calculate current position using kinematic equations
        pos = [
            self.initial_pos[0] + self.initial_vel[0]*t + 0.5*self.acceleration[0]*t*t,
            self.initial_pos[1] + self.initial_vel[1]*t + 0.5*self.acceleration[1]*t*t,
            0
        ]
        
        self.mobject.move_to(pos)

class CircularMotion(Animation):
    def __init__(self, 
                 mobject: VMobject,
                 radius: float,
                 angular_velocity: float,
                 **kwargs) -> None:
        """Initialize CircularMotion animation.
        
        Args:
            mobject (VMobject): The object to animate
            radius (float): The radius of the circular path
            angular_velocity (float): The angular velocity in radians per second
            **kwargs: Additional animation parameters
        """
        super().__init__(mobject, **kwargs)
        self.radius = radius
        self.angular_velocity = angular_velocity
        
    def interpolate_mobject(self, alpha: float) -> None:
        """Update the position of the object at each animation frame.
        
        Args:
            alpha (float): Animation progress from 0 to 1
        """
        # Calculate current time based on alpha
        t = alpha * self.run_time
        
        # Calculate position using parametric equations of circle
        x = self.radius * np.cos(self.angular_velocity * t)
        y = self.radius * np.sin(self.angular_velocity * t)
        
        self.mobject.move_to((x, y, 0))

class PendulumMotion(Animation):
    def __init__(self, 
                 mobject: VMobject,
                 length: float,
                 initial_angle: float,
                 **kwargs) -> None:
        """Initialize PendulumMotion animation.
        
        Args:
            mobject (VMobject): The object to animate
            length (float): The length of the pendulum
            initial_angle (float): The starting angle in radians
            **kwargs: Additional animation parameters
        """
        super().__init__(mobject, **kwargs)
        self.length = length
        self.initial_angle = initial_angle
        self.g = 9.81  # Acceleration due to gravity
        
        # Pre-calculate angular velocity at each time step for smooth animation
        dt = 0.01
        self.times = np.arange(0, kwargs.get('run_time', 1.0), dt)
        self.angles = np.zeros_like(self.times)
        self.angles[0] = initial_angle
        omega = 0  # Initial angular velocity
        
        # Solve pendulum motion using numerical integration
        for i in range(1, len(self.times)):
            alpha = -(self.g/self.length) * np.sin(self.angles[i-1])
            omega += alpha * dt
            self.angles[i] = self.angles[i-1] + omega * dt
        
    def interpolate_mobject(self, alpha: float) -> None:
        """Update the position of the object at each animation frame.
        
        Args:
            alpha (float): Animation progress from 0 to 1
        """
        # Get the angle at current time using interpolation
        if alpha == 1.0:  # Handle edge case
            theta = self.angles[-1]
        else:
            index = int(alpha * (len(self.times) - 1))
            theta = self.angles[index]
        
        # Convert polar to cartesian coordinates
        x = self.length * np.sin(theta)
        y = -self.length * np.cos(theta)  # Negative because y-axis points down in Manim
        
        self.mobject.move_to((x, y, 0))

    

    


    




        
    

    
    

    


    

    



    

    


