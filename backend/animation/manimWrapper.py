from manim import *
import numpy as np

class PendulumSystem(VGroup):
    """A visual representation of a pendulum system using Manim.
    
    This class creates a pendulum consisting of a bob (mass) attached to a fixed
    point (hinge) by a massless string.
    
    Args:
        mass_radius (float): Radius of the pendulum bob
        string_length (float): Length of the pendulum string
        hinge_point (tuple[float, float, float]): Position of the pendulum's pivot point
        mass_color (str): Color of the pendulum bob
        string_color (str): Color of the pendulum string
    """
    def __init__(self, mass_radius: float, string_length: float,
                 hinge_point: tuple[float, float, float] = ORIGIN,
                 mass_color: str = WHITE, string_color: str = WHITE):
        super().__init__()
        
        # Create components
        self.bob = Circle(radius=mass_radius, color=mass_color, fill_opacity=1)
        self.string = Line(start=hinge_point, end=hinge_point + DOWN * string_length, color=string_color)
        self.hinge = Circle(radius=0.05, color=string_color).move_to(hinge_point)
        
        # Add components to VGroup
        self.add(self.hinge, self.string, self.bob)
        self.bob.move_to(self.string.get_end())
        
        # Store properties
        self.string_length = string_length
        self.hinge_point = hinge_point

class SpringMassSystem(VGroup):
    """A visual representation of a spring-mass system using Manim.
    
    This class creates a system consisting of a mass attached to a fixed point
    by a spring, which can oscillate vertically.
    
    Args:
        mass_width (float): Width of the mass block
        spring_length (float): Natural length of the spring
        anchor_point (tuple[float, float, float]): Position of the spring's fixed end
        mass_color (str): Color of the mass block
        spring_color (str): Color of the spring
        num_coils (int): Number of coils in the spring visualization
    """
    def __init__(self, mass_width: float = 0.5, spring_length: float = 2.0,
                 anchor_point: tuple[float, float, float] = ORIGIN,
                 mass_color: str = WHITE, spring_color: str = WHITE,
                 num_coils: int = 10):
        super().__init__()
        
        # Create components
        self.mass = Square(side_length=mass_width, color=mass_color, fill_opacity=1)
        self.spring = self._create_spring(spring_length, num_coils, spring_color)
        self.anchor = Circle(radius=0.05, color=spring_color).move_to(anchor_point)
        
        # Add components to VGroup
        self.add(self.anchor, self.spring, self.mass)
        
        # Position components
        self.mass.move_to(anchor_point + DOWN * spring_length)
        self.spring.move_to((anchor_point + self.mass.get_center()) / 2)
        
        # Store properties
        self.spring_length = spring_length
        self.anchor_point = anchor_point
        self.num_coils = num_coils

    def _create_spring(self, length: float, num_coils: int, color: str) -> VMobject:
        """Helper method to create a spring visualization.
        
        Args:
            length (float): Length of the spring
            num_coils (int): Number of coils in the spring
            color (str): Color of the spring
            
        Returns:
            VMobject: A zigzag line representing a spring
        """
        points = []
        coil_width = 0.2  # Width of each coil
        num_points = num_coils * 2 + 2
        
        for i in range(num_points):
            y = -length * i / (num_points - 1)
            x = coil_width * (-1 if i % 2 else 1) if 0 < i < num_points - 1 else 0
            points.append([x, y, 0])
        
        spring = VMobject(color=color)
        spring.set_points_as_corners(points)
        return spring

class AnimationClass(Scene):
    """A class for creating and managing physics-based animations using Manim.
    
    This class provides methods to create and animate various physical systems like
    pendulums and spring-mass systems.
    """

    def __init__(self):
        """Initialize the AnimationClass."""
        super().__init__()


    def add_pendulum_system(self, mass_radius: float, string_length: float, 
                            hinge_point: tuple[float, float, float] = ORIGIN,
                            mass_color: str = WHITE, string_color: str = WHITE):
        """Add a pendulum system to the scene.
        
        Args:
            mass_radius (float): Radius of the pendulum bob
            string_length (float): Length of the pendulum string
            hinge_point (tuple[float, float, float]): Position of the pendulum's pivot point
            mass_color (str): Color of the pendulum bob
            string_color (str): Color of the pendulum string
            
        Returns:
            PendulumSystem: The created pendulum system
        """
        system = PendulumSystem(mass_radius, string_length, hinge_point, mass_color, string_color)
        self.add(system)
        return system

    def add_spring_mass_system(self, mass_width: float = 0.5, spring_length: float = 2.0,
                               anchor_point: tuple[float, float, float] = ORIGIN,
                               mass_color: str = WHITE, spring_color: str = WHITE,
                               num_coils: int = 10):
        """Add a spring-mass system to the scene.
        
        Args:
            mass_width (float): Width of the mass block
            spring_length (float): Natural length of the spring
            anchor_point (tuple[float, float, float]): Position of the spring's fixed end
            mass_color (str): Color of the mass block
            spring_color (str): Color of the spring
            num_coils (int): Number of coils in the spring visualization
            
        Returns:
            SpringMassSystem: The created spring-mass system
        """
        system = SpringMassSystem(mass_width, spring_length, anchor_point, mass_color, spring_color, num_coils)
        self.add(system)
        return system

    def spring_mass_motion(self, system: SpringMassSystem, amplitude: float, angular_frequency: float,
                           initial_phase: float = 0, damping: float = 0, duration: float = 3.0):
        """Animate a spring-mass system with harmonic motion."""
        self.play(SpringMassMotion(system, amplitude=amplitude, 
                            angular_frequency=angular_frequency,
                            initial_phase=initial_phase,
                            damping=damping,
                            run_time=duration))

    def pendulum_motion(self, obj: PendulumSystem, length: float, initial_angle: float, 
                        hinge_point: tuple[float, float, float] = ORIGIN, duration: float = 1.0):
        """Animate a pendulum system."""
        self.play(PendulumMotion(obj, length=length, initial_angle=initial_angle, 
                            hinge_point=hinge_point, run_time=duration))

    def add_text(self, text: str, position: tuple[float, float, float] = ORIGIN,
                 color: str = WHITE, font_size: float = 36) -> Text:
        """Add text to the scene.
        
        Args:
            text (str): The text to display
            position (tuple[float, float, float]): Position of the text
            color (str): Color of the text
            font_size (float): Size of the text
            
        Returns:
            Text: The created text object
        """
        text_obj = Text(text, color=color, font_size=font_size)
        text_obj.move_to(position)
        self.add(text_obj)
        return text_obj

class PendulumMotion(Animation):
    """An animation class for simulating pendulum motion with optional damping.
    
    This class handles the physics calculations and animation of a pendulum
    system, including damped motion if specified.
    
    Args:
        mobject (PendulumSystem): The pendulum system to animate
        length (float): Length of the pendulum
        initial_angle (float): Starting angle of the pendulum (in radians)
        hinge_point (tuple[float, float, float]): Position of the pendulum's pivot point
        damping (float): Damping coefficient for the motion
        **kwargs: Additional animation parameters
    """
    def __init__(self, 
                 mobject: PendulumSystem,
                 length: float,
                 initial_angle: float,
                 hinge_point: tuple[float, float, float] = ORIGIN,
                 damping: float = 0.0,
                 **kwargs) -> None:
        """Initialize PendulumMotion animation with damping."""
        super().__init__(mobject, **kwargs)
        self.system = mobject
        self.length = length
        self.initial_angle = initial_angle
        self.hinge_point = np.array(hinge_point)
        self.g = 9.81  # Acceleration due to gravity
        self.damping = damping  # Store damping factor
        
        # Pre-calculate angular velocity at each time step for smooth animation
        dt = 0.01
        self.times = np.arange(0, kwargs.get('run_time', 1.0), dt)
        self.angles = np.zeros_like(self.times)
        self.angles[0] = initial_angle
        omega = 0  # Initial angular velocity
        
        # Solve pendulum motion using numerical integration with damping
        for i in range(1, len(self.times)):
            alpha = -(self.g/self.length) * np.sin(self.angles[i-1]) - self.damping * omega
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
        
        # Convert polar to cartesian coordinates relative to hinge point
        x = self.hinge_point[0] + self.length * np.sin(theta)
        y = self.hinge_point[1] - self.length * np.cos(theta)  # Negative because y-axis points down in Manim
        
        # Update the entire pendulum system
        self.system.string.put_start_and_end_on(self.hinge_point, [x, y, 0])
        self.system.bob.move_to([x, y, 0])

class SpringMassMotion(Animation):
    """An animation class for simulating spring-mass motion with optional damping.
    
    This class handles the physics calculations and animation of a spring-mass
    system, including damped harmonic motion if specified.
    
    Args:
        mobject (SpringMassSystem): The spring-mass system to animate
        amplitude (float): Maximum displacement from equilibrium
        angular_frequency (float): Angular frequency of oscillation
        initial_phase (float): Initial phase of the oscillation (in radians)
        damping (float): Damping coefficient for the motion
        **kwargs: Additional animation parameters
    """
    def __init__(self, 
                 mobject: SpringMassSystem,
                 amplitude: float,
                 angular_frequency: float,
                 initial_phase: float = 0,
                 damping: float = 0,
                 **kwargs) -> None:
        super().__init__(mobject, **kwargs)
        self.system = mobject
        self.amplitude = amplitude
        self.angular_frequency = angular_frequency
        self.initial_phase = initial_phase
        self.damping = damping
        self.original_spring_length = self.system.spring_length
        
    def interpolate_mobject(self, alpha: float) -> None:
        t = alpha * self.run_time
        
        # Calculate displacement using damped harmonic motion equation
        displacement = self.amplitude * np.exp(-self.damping * t) * \
                      np.cos(self.angular_frequency * t + self.initial_phase)
        
        # Use system's properties directly
        anchor_point = self.system.anchor.get_center()
        
        # Update mass position
        new_y = anchor_point[1] - self.original_spring_length - displacement
        self.system.mass.move_to([anchor_point[0], new_y, 0])
        
        # Update spring using system's method
        new_spring = self.system._create_spring(
            abs(new_y - anchor_point[1]), 
            self.system.num_coils, 
            self.system.spring.get_color()
        )
        new_spring.move_to((anchor_point + self.system.mass.get_center()) / 2)
        self.system.spring.become(new_spring)

    

    



    

    


