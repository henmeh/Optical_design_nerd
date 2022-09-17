# Optical design nerd
### Video Demo: https://youtu.be/1CdijFd7Ay4
### GitHubLink: https://github.com/henmeh/Optical_design_nerd
### Description
## The Problem
As an optical designer it is critical to choose the perfect glasses for a new optical design. At the moment there are a lot of different glass manufactures in the world. And every company has it's own website to show the data of their glasses. The designer needs to see them all separately. Of course, as time goes on, he becomes more experienced. But especially at the beginning, the process is very time-consuming. At the moment there is no website that presents the data from different manufacturers in a way that an optical designer can work with quickly. Optical design nerd will change that.

## General thoughts
At the beginning I decided to do the coding outside of the CS50 environment because I wanted to run the project on my own. The website is written with React. I choosed React because I think if I want to make a real world live project out of this React is the better choise than plain HTML. So this is why the React code is not in here. But you can find it with the github link at the top.

## The Process
1. Download two big excel files from Schott and Ohara. In these files the companies have saved all their glasses with all physical properties like refractive index, transmission and so on.

2. With Pandas and Sqlite3 I saved the data from the excel files in a SQL database with 2 tables. One for Schott and one for Ohara. This is done with the file manage_database.py.
   First, an SQL database with 2 tables for Schott and Ohara is created. The manage_database.py file loads the excel file into a pandas dataframe using pandas. Then all entries in the dataframe are looped and the glass name, the transmission values and the constants of the dispersion equation are written to the database for each entry.
   This is done once for the data from schott and once for the data from ohara. At first I thought about storing all glasses in one table, but with several tables I think there is more flexibility if other glass manufacturers will be added.

3. A flask server in the app.py file processes user requests on the website. There are 3 server request options:
    1. Request for all glasses from Schott with a specific transmission at a specific wavelength
    2. Request for all glasses from Ohara with a specific transmission at a specific wavelength
    3. Search for a specific glass by glassname. Both tables are searched. If the glass cannot be found, an empty dict is returned.

As return for the queries there is a dict with the glass name as key and the constants of the dispersion equation as values. From these values, the website calculates the Abbe number and the dispersion number and plots the results.

## The Result
As you can see in the video, the website consists of 3 areas.
1. In the upper area there are three typical diagrams which are used for glass selection. You can switch between glasses from Schott, Ohara or both for the diagram. The display can also be changed for the diagram with 3D data.

2. In the lower left part, the designer can choose the minimum transmission that the glasses must have at a certain wavelength. The display of the diagrams is automatically updated accordingly.

In addition, the designer can select the wavelength range for which he is interested in the glasses. Abbe number and dispersion number are calculated automatically and the diagrams are also adjusted automatically.

3. If you move the mouse pointer over the diagrams, the individual data points are displayed. The designer can select glasses and enter them in the lower right part. There he can combine up to 3 glasses and receives an initial estimate for the correction of the color error of his choice of glasses.