# Required Python Packages
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
import numpy as np
import matplotlib.pyplot as plt


def dataset_statistics(dataset):
    """
    Basic statistics of the dataset
    :param dataset: Pandas dataframe
    :return: None, print the basic statistics of the dataset
    """
    print (dataset.describe())



def split_dataset(dataset, train_percentage, feature_headers, target_header):
    """
    Split the dataset with train_percentage
    :param dataset:
    :param train_percentage:
    :param feature_headers:
    :param target_header:
    :return: train_x, test_x, train_y, test_y
    """

    # Split dataset into train and test dataset
    train_x, test_x, train_y, test_y = train_test_split(dataset[feature_headers], dataset[target_header],
                                                        train_size=train_percentage)
    return train_x, test_x, train_y, test_y



def random_forest_classifier(features, target):
    """
    To train the random forest classifier with features and target data
    :param features:
    :param target:
    :return: trained random forest classifier
    """
    clf = RandomForestClassifier()
    clf.fit(features, target)
    return clf






HEADERS = ["id", "amenity_norm", "amenity_div_norm", "parking_bi", "bus_bi", "motor", "non_motor", "landscape_bi",
           "bc_max_norm", "built_ratio", "open_ratio", "clu_bi"]


dataset = pd.read_csv("Training_Data/Feature_Vector_Normalized_filter_grid_20160702.csv")
dataset_statistics(dataset)
train_x, test_x, train_y, test_y = split_dataset(dataset, 0.7, HEADERS[1:-1], HEADERS[-1])


# Create random forest classifier instance
trained_model = random_forest_classifier(train_x, train_y)
predictions = trained_model.predict(test_x)
 
print ("Train Accuracy :: ", accuracy_score(train_y, trained_model.predict(train_x)))
print ("Test Accuracy  :: ", accuracy_score(test_y, predictions))
print ("Confusion matrix ", confusion_matrix(test_y, predictions))


# get the model feature importance values
importances = trained_model.feature_importances_
std = np.std([tree.feature_importances_ for tree in trained_model.estimators_], axis=0)
indices = np.argsort(importances)[::-1]
attributes = np.array([HEADERS[indice+1] for indice in indices])

print("Feature Ranking:")
for f in range(train_x.shape[1]):
    print("%d. feature %s (%f)" % (f + 1, HEADERS[indices[f]+1], importances[indices[f]]))



# Plot the feature importances of the forest
plt.figure()
plt.title("Feature importances")
plt.bar(range(train_x.shape[1]), importances[indices],
       color="r", yerr=std[indices], align="center")
plt.xticks(range(train_x.shape[1]), attributes)
plt.xlim([-1, train_x.shape[1]])
plt.show()

