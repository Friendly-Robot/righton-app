[![](/assets/images/right_on_banner.png)](https://www.rightoneducation.com/)

# RightOn! Education

[RightOn!](https://www.rightoneducation.com/) is an app-based classroom activity that increases engagement and helps students feel better about math: think Kahoot/Fibbage + math + learning from and having fun with wrong answers.

Fun and motivation first – RightOn! is a math game show app for students to learn from and have fun with wrong answers. Rather than focusing on just increasing math proficiency -- which can leave behind many disengaged and underserved youth.

RightOn! is also working to increase self-confidence and self-efficacy through an engaging activity that applies research into learning from mistakes and common misconceptions.

## Help Wanted!

We’re looking to work with people who are interested in making a difference in youth education. We are building mobile apps on AWS using technologies including React Native, Node.js, DynamoDB, and Amplify/Lambda. Experience with AI/ML is a plus.

### Contributing

We welcome contributions from everyone. Please report issues directly to us or make Pull Requests for any features or bug fixes. As much as we like to reward mistakes, we want to fix as many of them as possible too. Your contribution counts!

Please refer to our [Contribution Guide](https://github.com/righton-dev/righton-app/tree/master/CONTRIBUTING.md).

### Current Tech Stack

- [User flow diagram](http://bit.ly/2J3ye5t)
- [Wireframes](http://bit.ly/RightOn_Wireframes)
- [Prototype - Android (download the release.apk)](http://bit.ly/righton-android)
- [Prototype - iOS (first requires installation of TestFlight)](http://bit.ly/righton-ios)

### Getting Started

#### 1) Clone project

`git clone https://github.com/righton-dev/righton-app.git`

#### 2) Install node modules

`npm install`

#### 3) Install on device

`npm run ios`
`npm run android`

#### 4) Start your app

`npm start`

### Files needed / Additional notes

- The `react-native` npm package.
- A `local.properties` file if testing on Android.
- The Xcode editor if testing on iOS.

#### Note:

Some NPM packages may be outdated and need to be altered for the Android build.
<br>
If you encounter the following error:
<br>

> A problem occurred evaluating project ':amazon-cognito-identity-js'.
> Could not find method implementation() for arguments [com.facebook.react:react-native:+] > <br>
> Locate the `build.gradle` file in `node_modules/amazon-cognito-identity.js/android`, find the line mentioned in the `dependencies` object, and change `implementation` to `compile`.
> <br> <br>
> If you receive a `hasteImpl returning the same name for different files` error in your packager. This is due to identical path names created by AWS Amplify. To fix this issue, simply drag the `#current-cloud-backend` folder from `${root}/amplify` out, restart the packager and run again.

### Additional Documentation

Please refer to our [docs](https://github.com/righton-dev/righton-app/tree/master/docs)

### Tests

You are welcome to download our latest beta version to test and give feedback. Please use Test Flight to install our app from this link: https://testflight.apple.com/join/2l8414MU

### Deployment

Coming soon!

## Community

### Communication channels

Please join us on Slack at #RightOnEducation. We want to hear from you about your experience!

### Meet our team

<strong>Andy Li</strong> - Mobile Developer<br>
<strong>Daz Yang</strong> - Full-Stack Web Developer<br>
<strong>Edward Tan</strong> - Tech Lead<br>
<strong>Kai King</strong> - Math Educator<br>
<strong>Sinclair Wu</strong> - Product Lead<br>

### Advisors

<strong>Ay-Nur Najm</strong> - Independent math consultant and computer science teacher<br>
<strong>Ben Woodford</strong> - Doctoral scholar at Stanford specializing in math education<br>
<strong>Eric Boucher</strong> - Cofounder & CEO of Ovio<br>
<strong>Payton Richardson</strong> - Mixed-methods research analyst at the Center for Research on Education Outcomes (CREDO) at Stanford University

<em>Learn more about RightOn & our team @https://rightoneducation.com</em>
