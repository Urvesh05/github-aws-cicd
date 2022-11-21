
aws_region_name="us-east-1"
# arr=("Admins" "audit_log" "client" "Client-Answers" "Documents-Live" "Job-Activity" "Job-History" "jurisdictions" "MasterRequirements" "Monitor-Log" "permission" "Requirement-Notifications" "Requirements-Live" "Research-Notifications" "Research-Results" "Results-Templates" "Users" "Versioned-Documents" "Versioned-Requirements")
arr=("test" "test2")
if [ "$s1" == "test" ]
then
    for table_name in ${arr[@]}
    do
        max_items=100

        index=0
        start_time="$(date -u +%s)"


        if [ ! -d $table_name ]
        then
            echo "created folder ${table_name}"
            mkdir $table_name
        fi

        if [ ! -d $table_name/data ]
        then
            echo "created folder ${table_name}/data"
            mkdir $table_name/data
        fi
        aws dynamodb scan --table-name $table_name --region $aws_region_name --max-items $max_items --output json > ./$table_name/data/$index.json

        nextToken=$(cat ./$table_name/data/$index.json | jq '.NextToken')
        echo $nextToken

        ((index+=1))


        echo "created ${index} dataset"

        while [ ! -z "${nextToken}" ] && [ "${nextToken}" != "null" ]
        do
            aws dynamodb scan --table-name $table_name --region $aws_region_name --max-items $max_items --starting-token $nextToken --output json > ./$table_name/data/$index.json
            nextToken=$(cat ./$table_name/data/$index.json | jq '.NextToken')
            #echo $(cat ./$table_name/data/$index.json | jq '.Items') > ./$table_name/data/$index.json
            ((index+=1))
            echo "created ${index} dataset"
        done

        end_export_time="$(date -u +%s)"
        echo "used $(($end_export_time-$start_time)) seconds for export data"

        # fi


        if [ ! -d $table_name/ScriptForDataImport ]
        then
            echo "created folder ${table_name}/ScriptForDataImport"
            mkdir $table_name/ScriptForDataImport
        fi
        mkdir -p $table_name/ScriptForDataImport
        #split record to aws batch insert cli
        for filename in $table_name/data/*.json; do
            file=${filename##*/}
            cat $filename | jq '.Items' | jq -cM --argjson sublen '25' 'range(0; length; $sublen) as $i | .[$i:$i+$sublen]' | split -l 1 - ${table_name}/ScriptForDataImport/${file%.*}_
        done

        for filename in $table_name/ScriptForDataImport/*; do
            echo "processing ${filename##*/}"
            cat $filename | jq "{\"$table_name\": [.[] | {PutRequest: {Item: .}}]}" > $table_name/ScriptForDataImport/${filename##*/}.txt
            rm $filename
        done

        end_convert_time="$(date -u +%s)"
        echo "used $(($end_convert_time-$end_export_time)) seconds for generating the  insert scripts"

        ##script run time
        echo "Completed"
        echo "***************************************************************************************"
        end_func_time="$(date -u +%s)"
        echo "Total of $(($end_func_time-$start_time)) seconds to completed the function"
    done    
fi
