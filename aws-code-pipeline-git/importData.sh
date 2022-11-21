start_time="$(date -u +%s)"
aws_region_name=$2
arr=($1)
for folder_path in ${arr[@]}
do
    #import all data in the folder
    for filename in $folder_path/ScriptForDataImport/*.txt; do
        echo "importing ${filename}"
        aws dynamodb batch-write-item --request-items file://${filename}
    done
    echo "Completed"    
    ##script run time
    end_func_time="$(date -u +%s)"
    echo "Total of $(($end_func_time-$start_time)) seconds to completed the function"
    # rm -rf $folder_path/
done
