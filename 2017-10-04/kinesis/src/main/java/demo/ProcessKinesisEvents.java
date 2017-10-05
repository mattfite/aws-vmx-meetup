package demo;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.KinesisEvent;
import com.amazonaws.services.lambda.runtime.events.KinesisEvent.KinesisEventRecord;

public class ProcessKinesisEvents implements RequestHandler<KinesisEvent, Void>{
	@Override
	public Void handleRequest(KinesisEvent event, Context context)
	{
		for(KinesisEventRecord rec : event.getRecords()) {
			System.out.println(new String(rec.getKinesis().getData().array()));
            context.getLogger().log(new String(rec.getKinesis().getData().array()));
		}
		return null;
	}
}
