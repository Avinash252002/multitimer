## 🛠 How to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/Avinash252002/multitimer.git
   cd multitimer

2. **Install dependencies**
    ```bash
   npm install

3. **Start the Expo development server**
    ```bash
    npx expo start

✅ Feature Checklist

**Core Features**

1.Add new timers with name, duration, and category

2.Save and persist timers using AsyncStorage

3.Display timers grouped by category

4.Expand/collapse category sections

5.Start, pause, and reset individual timers

6.Show remaining time and status (Running, Paused, Completed)

7.Visualize progress using progress bar or percentage

8.Bulk start, pause, and reset timers by category

9.Show modal feedback when a timer completes

**Enhanced Functionality**

1.History screen with log of completed timers

2.Show timer name and completion timestamp

3.Optional halfway alert with on-screen notification

**Bonus Features**

1.Export timer history as a JSON file

2.Support for light and dark themes with a toggle

3.Category filtering dropdown


**Assumptions Made**

1.Halfway alerts are shown once per timer instance.

2.AsyncStorage is sufficient for persistence (no external DB used).

3.Expo is used to simplify setup and testing on multiple devices.


