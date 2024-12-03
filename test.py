from manimWrapper import AnimationClass
import numpy as np

class TestScene(AnimationClass):
    def construct(self):
        # Test 1: Projectile Motion
        ball = self.add_circle(radius=0.2, color="RED")
        self.linear_motion(
            ball,
            initial_pos=(-5, 0, 0),
            initial_vel=(5, 10, 0),
            acceleration=(0, -9.81, 0),
            duration=2,
        )
        
        # Test 2: Pendulum
        self.pendulum_motion(
            obj=ball,
            length=3,
            initial_angle=np.pi/4,
            duration=5,
        )
        
        # Test 3: Circular Motion
        self.circular_motion(
            obj=ball,
            radius=2,
            angular_velocity=2,
            duration=4,
        )




