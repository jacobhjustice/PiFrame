# PiFrame extensions.py
# Manages active extension information for the PiFrame application.
# An extension can be defined as any feature that can be turned on/off.

import enum

# Extensions is an enumumeration where each constant translates to some power of 2.
# This format is used to easily parse from the .DAT file in its binary form.
# Future extensions should be added here following the pattern (1, 2, 4, 8, 16, 32, ...).
class Extensions(enum.Enum):
    picture = 1
    clock = 2
    weather = 4
    quotes = 8
