# esrileaflet3JS

Basic Esri-Leaflet/three.js hybrid example.  This is a basic Node.js application that is designed to support the following use cases and technical requirements:

* Integrate a 2d and 3d view based on a map extent
* Support ArcGIS.com base maps
* Leaflet and no Dojo

Three.js is used to support edge case scenarios such as sub-surface mapping.

## Prerequisites

* Node.js installed

## Getting Started

1.  Clone the Application
2.  CD to the Application
3.  Install npm dependencies<br><pre><code>npm install</code></pre>
4.  Install JavaScript packages<br><pre><code>bower install</code></pre>
5.  Start Node Server<br><pre><code>node server.js</code></pre>
6.  Open a browser and go to http://localhost:1337/

<b>NOTE:</b>  Node is only used to serve up the web application.  The web app can be deployed to a server or PaaS that is not using Node.

## Roadmap

* Integrate 3d point cloud data via 3.js surface.  See: https://github.com/geommills/esrileaflet3JS/issues


## License

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
