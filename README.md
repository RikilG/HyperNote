[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<p align="center">
  <!-- <a href="https://github.com/RikilG/HyperNote">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h2 align="center">HyperNote</h2>

  <p align="center">
    A productivity application and a personal wiki!
    <!-- <br />
    <a href="https://github.com/RikilG/HyperNote"><strong>Explore the docs »</strong></a> -->
    <br />
    <!-- <a href="https://github.com/RikilG/HyperNote">View Demo</a>
    · -->
    <a href="https://github.com/RikilG/HyperNote/issues">HyperNotert Bug</a>
    ·
    <a href="https://github.com/RikilG/HyperNote/issues">Request Feature</a>
  </p>
</p>


## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contributors](#contributors)


## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
The main aim behind this project was to build a general productivity 
applicaiton and a personal wiki which can also be used as a general purpose note
taking application or a diary. We still have plans to implement several other 
features as addons to the current applications, so stay tuned!

### Built With

 - [Electron](https://www.electronjs.org)
 - [React](https://www.reactjs.org)


## Getting Started

To get a local copy up and running follow these simple steps. The current 
build setup is run and tested on windows 10. So other platforms are not yet 
fully supported.

### Prerequisites

[npm](https://www.npmjs.com) is reqired to be installed on
your PC to build the project from source

### Installation
 
1. Clone the repo
```sh
git clone https://github.com/RikilG/HyperNote.git
cd HyperNote
```
2. Install NPM packages
```sh
npm install
```
3. Run the application
```sh
npm start
```

## Usage

The current application by default uses a working directory in your %APPDATA%
folder. this can be changed in settings.  
As of now, the application supports:
- listing files
- creating files/folders
- rendering markdown (with realtime preview)
- editing files (not saving yet :)
- multiple splits for editing (horizontal only for now)
- pomodoro timers

## Roadmap

- [x] Give option to toggle b/w renderer and editor (or) split renderer
- [x] Provide a default page with info when no files are open (similar to vscode blank tab when no files are open)
- [ ] Add file save functionality
- [x] Add pomodoro framework
- [ ] Add trello framework
- [ ] Add calendar
- [ ] Integrate with desktop notifications

## Contributing

Have a feature you would like to add? know a solution to 
the issue you are having? Follow the steps to contribute 
to this project!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch         (`git push origin AmazingFeature`)
5. Open a Pull Request


## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contributors

 - Rikil Gajarla ([github](https://www.github.com/RikilG))
 - Srihari L ([github](https://www.github.com/SrihariLax))

<!-- ### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment) -->


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/RikilG/HyperNote.svg?style=flat-square
[contributors-url]: https://github.com/RikilG/HyperNote/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/RikilG/HyperNote.svg?style=flat-square
[forks-url]: https://github.com/RikilG/HyperNote/network/members
[stars-shield]: https://img.shields.io/github/stars/RikilG/HyperNote.svg?style=flat-square
[stars-url]: https://github.com/RikilG/HyperNote/stargazers
[issues-shield]: https://img.shields.io/github/issues/RikilG/HyperNote.svg?style=flat-square
[issues-url]: https://github.com/RikilG/HyperNote/issues
[license-shield]: https://img.shields.io/github/license/RikilG/HyperNote.svg?style=flat-square
[license-url]: https://github.com/RikilG/HyperNote/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
